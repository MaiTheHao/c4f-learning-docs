/** Document header meta: category pill, raw path and breadcrumb trail. */

import { DOM } from '../core/dom.js';

export function updateBreadcrumb(docPath) {
  const parts = docPath.split('/');
  const cat = parts[0] || 'doc';

  DOM.docCategory.textContent = cat.toUpperCase();
  DOM.docCategory.className = `category-pill cat-${cat}`;
  DOM.docPathDisplay.textContent = docPath;

  let breadcrumbHtml = `<span class="breadcrumb-item">${cat}</span>`;
  for (let i = 1; i < parts.length; i++) {
    const isLast = i === parts.length - 1;
    breadcrumbHtml += `
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-item ${isLast ? 'active' : ''}">${parts[i]}</span>
    `;
  }
  DOM.breadcrumb.innerHTML = breadcrumbHtml;
}
