/**
 * Right-hand table of contents.
 * Assigns heading ids (also used by deep links) and renders the TOC nav.
 */

import { DOM } from '../core/dom.js';
import { pushDocAnchor } from '../core/router.js';
import { slugify } from '../utils/slug.js';
import { escapeHtml } from '../utils/html.js';
import { scrollToAnchor } from '../utils/anchor.js';

export function generateHeadingsAndTOC(container) {
  const headings = container.querySelectorAll('h1, h2, h3, h4');
  const tocItems = [];

  headings.forEach((heading, idx) => {
    let id = heading.id || slugify(heading.textContent);
    if (!id) id = `heading-${idx}`;
    heading.id = id;

    // Add to TOC (skip H1 as it represents main doc title)
    const tagName = heading.tagName.toLowerCase();
    if (tagName !== 'h1') {
      tocItems.push({
        id: id,
        title: heading.textContent.trim(),
        level: tagName
      });
    }
  });

  if (tocItems.length === 0) {
    DOM.tocNav.innerHTML = '<p class="toc-empty">Không có mục con</p>';
    return;
  }

  DOM.tocNav.innerHTML = tocItems.map(item => `
    <a class="toc-link toc-${item.level}" href="#${item.id}" data-anchor="${item.id}" title="${escapeHtml(item.title)}">
      ${escapeHtml(item.title)}
    </a>
  `).join('');

  DOM.tocNav.querySelectorAll('.toc-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const anchor = link.getAttribute('data-anchor');
      scrollToAnchor(anchor);
      pushDocAnchor(anchor);
    });
  });
}
