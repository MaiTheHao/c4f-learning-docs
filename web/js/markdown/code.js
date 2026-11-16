/**
 * Code blocks: copy-to-clipboard button plus Prism syntax highlighting.
 * Mermaid blocks are skipped - they are replaced by diagrams in mermaid.js.
 */

export function setupCodeBlocksWithCopy(container) {
  const preBlocks = container.querySelectorAll('pre');
  preBlocks.forEach(pre => {
    const code = pre.querySelector('code');
    if (!code) return;

    // Skip mermaid blocks (they get replaced with SVG)
    if (code.classList.contains('language-mermaid')) {
      return;
    }

    // Wrap in wrapper for copy button positioning
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-code-btn';
    copyBtn.textContent = 'Copy';

    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.textContent);
        copyBtn.textContent = 'Copied!';
        copyBtn.style.background = '#238636';
        setTimeout(() => {
          copyBtn.textContent = 'Copy';
          copyBtn.style.background = '';
        }, 2000);
      } catch (err) {
        copyBtn.textContent = 'Failed';
      }
    });

    wrapper.appendChild(copyBtn);
  });

  // Run Prism highlighting
  if (window.Prism) {
    Prism.highlightAllUnder(container);
  }
}
