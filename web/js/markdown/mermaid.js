/**
 * Mermaid diagram engine.
 * Converts ```mermaid fenced blocks into <div class="mermaid"> wrappers and
 * renders them with the locally vendored Mermaid build.
 */

export async function renderMermaidDiagrams(container) {
  const mermaidCodes = container.querySelectorAll('pre code.language-mermaid, div.mermaid');
  if (mermaidCodes.length === 0) return;

  mermaidCodes.forEach(codeEl => {
    const codeText = codeEl.textContent;
    const pre = codeEl.closest('pre') || codeEl;

    const wrapper = document.createElement('div');
    wrapper.className = 'mermaid-wrapper';

    const mDiv = document.createElement('div');
    mDiv.className = 'mermaid';
    mDiv.textContent = codeText;

    wrapper.appendChild(mDiv);
    pre.replaceWith(wrapper);
  });

  if (window.mermaid) {
    try {
      await mermaid.run({
        nodes: container.querySelectorAll('.mermaid')
      });
    } catch (err) {
      console.warn('Mermaid rendering error:', err);
    }
  }
}
