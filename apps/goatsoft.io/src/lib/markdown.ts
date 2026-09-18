/**
 * Tiny Markdown renderer for our own trusted docs (PRIVACY.md), rendered in a dialog.
 * Handles headings, paragraphs, unordered lists, and inline bold / links / code. The
 * input is authored by us, but we still escape HTML before applying inline rules.
 */
function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function inline(s: string): string {
  return escapeHtml(s)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}

export function renderMarkdown(md: string): string {
  return md.trim().split(/\n{2,}/).map((block) => {
    const lines = block.split('\n')
    const heading = lines.length === 1 ? (lines[0] ?? '').match(/^(#{1,4})\s+(.*)$/) : null
    if (heading) {
      const level = Math.min((heading[1] ?? '#').length + 1, 4)
      return `<h${level}>${inline(heading[2] ?? '')}</h${level}>`
    }
    if (lines.every(l => /^[-*]\s+/.test(l))) {
      return `<ul>${lines.map(l => `<li>${inline(l.replace(/^[-*]\s+/, ''))}</li>`).join('')}</ul>`
    }
    return `<p>${inline(block.replace(/\n/g, ' '))}</p>`
  }).join('\n')
}
