import { GLSL_FS, GLSL_VS, WGSL, type AuroraPalette } from './aurora-shaders.ts'

export interface AuroraOptions {
  colors: AuroraPalette
  /** Cover the viewport and follow scroll at `parallax` speed (page background mode). */
  fixed: boolean
  parallax: number
  intensity: number
  /** Noise zoom: smaller = broader ribbons. */
  scale: number
  speed: number
  /** Fade the top and bottom edges out. */
  fade: boolean
  seed: number
  /** Horizontal stretch: smaller = longer, wispier ribbons. */
  stretch: number
  /** 0..1: blend toward a fixed left-to-right c0 -> c2 gradient. */
  sweep: number
}

export type AuroraMode = 'webgpu' | 'webgl' | 'css'

/** Uniform block, 80 bytes: res.xy time scroll | c0.xyz intensity | c1.xyz scale | c2.xyz speed | fade seed stretch sweep */
export function fillAuroraUniforms(out: Float32Array, o: AuroraOptions, width: number, height: number, time: number, scroll: number) {
  out.set([width, height, time, scroll])
  out.set([...o.colors[0], o.intensity], 4)
  out.set([...o.colors[1], o.scale], 8)
  out.set([...o.colors[2], o.speed], 12)
  out.set([o.fade ? 1 : 0, o.seed, o.stretch, o.sweep], 16)
}

const MAX_WIDTH = 1280
const TARGET_FPS = 30

/**
 * Owns one canvas and its graphics resources from asynchronous setup through disposal.
 * WebGPU first, WebGL2 second, CSS (handled by the caller) last. Draws at most 30 fps,
 * at half device resolution, only while visible; reduced motion draws one still frame. @see ADR 0005
 */
export function createAuroraRenderer(options: () => AuroraOptions, reduced: boolean) {
  const uni = new Float32Array(20)
  let raf = 0
  let visible = true
  let disposed = false
  let stop: (() => void) | null = null
  let draw: (() => void) | null = null
  const t0 = performance.now()
  let last = 0

  function size(el: HTMLCanvasElement) {
    const r = el.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2) * 0.5
    const w = Math.max(2, Math.min(MAX_WIDTH, Math.round(r.width * dpr)))
    const h = Math.max(2, Math.round(r.height * dpr))
    if (el.width !== w || el.height !== h) { el.width = w; el.height = h }
    return [w, h] as const
  }

  function fill(w: number, h: number) {
    const o = options()
    const scroll = o.fixed ? (window.scrollY / Math.max(1, window.innerHeight)) * o.parallax : 0
    fillAuroraUniforms(uni, o, w, h, reduced ? 0 : (performance.now() - t0) / 1000, scroll)
  }

  async function initWebGPU(el: HTMLCanvasElement): Promise<boolean> {
    const gpu = (navigator as Navigator & { gpu?: GPU }).gpu
    if (!gpu || disposed) return false
    const adapter = await gpu.requestAdapter()
    if (!adapter || disposed) return false
    const device = await adapter.requestDevice()
    if (disposed) { device.destroy(); return false }
    stop = () => { cancelAnimationFrame(raf); device.destroy() }
    const ctx = el.getContext('webgpu') as GPUCanvasContext | null
    if (!ctx) { stop(); stop = null; return false }
    const format = gpu.getPreferredCanvasFormat()
    ctx.configure({ device, format, alphaMode: 'premultiplied' })
    const module = device.createShaderModule({ code: WGSL })
    const pipeline = device.createRenderPipeline({
      layout: 'auto',
      vertex: { module, entryPoint: 'vs' },
      fragment: { module, entryPoint: 'fs', targets: [{ format }] },
      primitive: { topology: 'triangle-list' },
    })
    const buf = device.createBuffer({ size: 80, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST })
    const bind = device.createBindGroup({ layout: pipeline.getBindGroupLayout(0), entries: [{ binding: 0, resource: { buffer: buf } }] })
    draw = () => {
      const [w, h] = size(el)
      fill(w, h)
      device.queue.writeBuffer(buf, 0, uni)
      const enc = device.createCommandEncoder()
      const pass = enc.beginRenderPass({ colorAttachments: [{ view: ctx.getCurrentTexture().createView(), clearValue: { r: 0, g: 0, b: 0, a: 0 }, loadOp: 'clear', storeOp: 'store' }] })
      pass.setPipeline(pipeline); pass.setBindGroup(0, bind); pass.draw(3); pass.end()
      device.queue.submit([enc.finish()])
    }
    loop()
    return true
  }

  function initWebGL(el: HTMLCanvasElement): boolean {
    if (disposed) return false
    const gl = el.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'low-power' })
    if (!gl) return false
    stop = () => { cancelAnimationFrame(raf); gl.getExtension('WEBGL_lose_context')?.loseContext() }
    const sh = (type: number, src: string) => {
      const shader = gl.createShader(type)
      if (!shader) throw new Error('Unable to create aurora shader')
      gl.shaderSource(shader, src)
      gl.compileShader(shader)
      return shader
    }
    const prog = gl.createProgram()
    if (!prog) throw new Error('Unable to create aurora program')
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, GLSL_VS))
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, GLSL_FS))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { stop(); stop = null; return false }
    gl.useProgram(prog)
    const ubo = gl.createBuffer()
    if (!ubo) throw new Error('Unable to create aurora uniform buffer')
    gl.bindBuffer(gl.UNIFORM_BUFFER, ubo)
    gl.bufferData(gl.UNIFORM_BUFFER, 80, gl.DYNAMIC_DRAW)
    gl.uniformBlockBinding(prog, gl.getUniformBlockIndex(prog, 'U'), 0)
    gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, ubo)
    gl.bindVertexArray(gl.createVertexArray())
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    draw = () => {
      const [w, h] = size(el)
      fill(w, h)
      gl.viewport(0, 0, w, h)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.bindBuffer(gl.UNIFORM_BUFFER, ubo)
      gl.bufferSubData(gl.UNIFORM_BUFFER, 0, uni)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    loop()
    return true
  }

  function loop() {
    if (disposed || !draw) return
    if (reduced) { draw(); return }
    const tick = (now: number) => {
      if (disposed) return
      raf = requestAnimationFrame(tick)
      if (!visible || document.hidden) return
      if (now - last < 1000 / TARGET_FPS) return
      last = now
      draw?.()
    }
    raf = requestAnimationFrame(tick)
  }

  return {
    async start(el: HTMLCanvasElement): Promise<AuroraMode> {
      if (disposed) return 'css'
      try { if (await initWebGPU(el)) return 'webgpu' } catch { stop?.(); stop = null }
      if (disposed) return 'css'
      try { if (initWebGL(el)) return 'webgl' } catch { stop?.(); stop = null }
      return 'css'
    },
    /** Redraw once (reduced motion or option change). */
    refresh() { if (reduced) draw?.() },
    setVisible(value: boolean) { visible = value; if (reduced && value) draw?.() },
    dispose() {
      if (disposed) return
      disposed = true
      cancelAnimationFrame(raf)
      stop?.()
      stop = null
      draw = null
    },
  }
}
