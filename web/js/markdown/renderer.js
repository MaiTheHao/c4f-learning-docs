/**
 * Markdown render pipeline.
 * Marked (locally vendored) produces HTML, then each transformer decorates it.
 * Order matters: links/images are rewritten before anchors and TOC are built.
 */

import { state } from '../core/state.js';
import { DOM } from '../core/dom.js';
import { escapeHtml } from '../utils/html.js';
import { scrollToAnchor } from '../utils/anchor.js';
import { resolveImageAndMediaPaths, interceptInternalLinks } from './links.js';
import { transformAlerts } from './alerts.js';
import { setupCodeBlocksWithCopy } from './code.js';
import { renderMermaidDiagrams } from './mermaid.js';
import { generateHeadingsAndTOC } from '../ui/toc.js';

export function renderMarkdown(markdown, docPath, targetAnchor = '') {
  const docDir = docPath.includes('/') ? docPath.substring(0, docPath.lastIndexOf('/')) : '';

  // Extract first H1 heading as document title if present
  const h1Match = markdown.match(/^#\s+(.+)$/m);
  if (h1Match) {
    const cleanTitle = h1Match[1].replace(/\[(.*?)\]\(.*?\)/g, '$1').replace(/[*`_]/g, '');
    DOM.docTitle.textContent = cleanTitle;
  } else {
    const fallback = state.manifest.find(d => d.path === docPath);
    DOM.docTitle.textContent = fallback ? fallback.title : docPath.split('/').pop();
  }

  // Configure Marked
  if (window.marked) {
    marked.setOptions({
      gfm: true,
      breaks: false
    });
  }

  // Parse Markdown to HTML
  const rawHtml = window.marked ? marked.parse(markdown) : `<pre>${escapeHtml(markdown)}</pre>`;
  DOM.markdownContainer.innerHTML = rawHtml;

  // Post-Processing Transformers
  resolveImageAndMediaPaths(DOM.markdownContainer, docDir);
  interceptInternalLinks(DOM.markdownContainer, docDir);
  transformAlerts(DOM.markdownContainer);
  setupCodeBlocksWithCopy(DOM.markdownContainer);
  generateHeadingsAndTOC(DOM.markdownContainer);
  renderMermaidDiagrams(DOM.markdownContainer);

  DOM.loadingState.style.display = 'none';

  // Scroll to target anchor if requested, otherwise top
  if (targetAnchor) {
    scrollToAnchor(targetAnchor);
  } else {
    DOM.contentArea.scrollTop = 0;
  }
}
