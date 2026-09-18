import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

/**
 * Build configuration. Layer boundaries (@see ADR 0002):
 * - `src/application` is the only auto-import directory (composables / use cases).
 * - `src/presentation/components` is the only component auto-registration root.
 * - `src/domain` and `src/infrastructure` are always imported explicitly.
 */
export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), 'VITE_'), ...process.env }
  return {
    base: env.VITE_BASE || '/',
    plugins: [
      vue(),
      tailwindcss(),
      AutoImport({
        imports: ['vue', { 'motion-v': ['useScroll', 'useTransform', 'useSpring', 'useMotionValue', 'useInView', 'useReducedMotion'] }],
        dirs: ['src/application/**'],
        dts: 'src/auto-imports.d.ts',
        vueTemplate: true,
      }),
      Components({
        dirs: ['src/presentation/components'],
        deep: true,
        dts: 'src/components.d.ts',
        resolvers: [IconsResolver({ prefix: 'i' })],
      }),
      Icons({
        compiler: 'vue3',
        autoInstall: false,
        // Hugeicons ship at a 1.5 stroke; tag them so main.css can set the weight once.
        iconCustomizer(collection, _icon, props) {
          if (collection === 'hugeicons') props.class = [props.class, 'hg'].filter(Boolean).join(' ')
        },
      }),
    ],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    build: {
      target: 'es2022',
      cssMinify: 'lightningcss',
    },
  }
})
