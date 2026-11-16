/**
 * Sidebar file tree: category grouping, folder collapse, search filtering
 * and active-document highlighting.
 */

import { state } from '../core/state.js';
import { DOM } from '../core/dom.js';
import { navigateTo } from '../core/router.js';
import { escapeHtml } from '../utils/html.js';

const CATEGORY_LABELS = {
  release: '🚀 RELEASE (Chính thức)',
  temporary: '⏳ TEMPORARY (Bản nháp)',
  interesting: '💡 INTERESTING (Thú vị)'
};

const CATEGORY_ORDER = ['release', 'temporary', 'interesting'];

export function renderFileTree() {
  const { manifest, activeCategory, searchQuery } = state;
  let filtered = manifest;

  if (activeCategory !== 'all') {
    filtered = filtered.filter(doc => doc.category === activeCategory);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(doc =>
      doc.title.toLowerCase().includes(q) || doc.path.toLowerCase().includes(q)
    );
  }

  DOM.docCounter.textContent = `${filtered.length} tài liệu`;

  if (filtered.length === 0) {
    DOM.treeContainer.innerHTML = `
      <div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 13px;">
        Không tìm thấy tài liệu phù hợp
      </div>
    `;
    return;
  }

  // If searching, show flat list for quick scanning
  if (searchQuery) {
    DOM.treeContainer.innerHTML = filtered.map(doc => renderFlatItem(doc)).join('');
    attachTreeItemListeners();
    return;
  }

  DOM.treeContainer.innerHTML = renderGroupedTree(filtered);
  attachFolderToggleListeners();
  attachTreeItemListeners();
}

function renderFlatItem(doc) {
  const isActive = doc.path === state.currentDocPath ? 'active' : '';
  return `
    <a class="tree-item ${isActive}" href="#${doc.path}" data-path="${doc.path}">
      <span class="badge-cat cat-${doc.category}">${doc.category.toUpperCase().slice(0, 3)}</span>
      <span class="tree-item-title" title="${doc.path}">${escapeHtml(doc.title)}</span>
    </a>
  `;
}

function renderGroupedTree(docs) {
  const tree = {};
  for (const doc of docs) {
    const cat = doc.category;
    if (!tree[cat]) tree[cat] = {};

    const relFolder = doc.folder.replace(new RegExp(`^${cat}\\/?`), '');
    if (!tree[cat][relFolder]) tree[cat][relFolder] = [];
    tree[cat][relFolder].push(doc);
  }

  let treeHtml = '';
  for (const cat of CATEGORY_ORDER) {
    if (!tree[cat]) continue;
    const folderKeys = Object.keys(tree[cat]).sort();

    treeHtml += `
      <div class="tree-group">
        <div class="tree-group-title">
          <span>${CATEGORY_LABELS[cat] || cat}</span>
          <span class="badge-cat cat-${cat}">${countDocsInCat(tree[cat])}</span>
        </div>
    `;

    for (const folder of folderKeys) {
      treeHtml += renderFolder(cat, folder, tree[cat][folder]);
    }

    treeHtml += `</div>`;
  }
  return treeHtml;
}

function renderFolder(cat, folder, docs) {
  const isRootFolder = !folder;
  const folderName = isRootFolder
    ? 'Gốc'
    : folder.split('/').pop().replace(/^\d+_/, '').replace(/_/g, ' ');
  const isOpen = state.currentDocPath && state.currentDocPath.startsWith(`${cat}/${folder}`) ? 'open' : '';

  const items = docs.map(doc => {
    const isActive = doc.path === state.currentDocPath ? 'active' : '';
    return `
      <a class="tree-item ${isActive}" href="#${doc.path}" data-path="${doc.path}">
        <svg class="tree-item-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
        <span class="tree-item-title" title="${doc.path}">${escapeHtml(doc.title)}</span>
      </a>
    `;
  }).join('');

  return `
    <div class="tree-folder ${isOpen || isRootFolder ? 'open' : ''}">
      <div class="tree-folder-title">
        <span class="folder-arrow">▶</span>
        <span class="folder-name">${escapeHtml(folderName)}</span>
      </div>
      <div class="tree-folder-content">
        ${items}
      </div>
    </div>
  `;
}

function countDocsInCat(catFolders) {
  let count = 0;
  for (const k in catFolders) {
    count += catFolders[k].length;
  }
  return count;
}

function attachFolderToggleListeners() {
  DOM.treeContainer.querySelectorAll('.tree-folder-title').forEach(titleEl => {
    titleEl.addEventListener('click', () => {
      const folderEl = titleEl.closest('.tree-folder');
      if (folderEl) {
        folderEl.classList.toggle('open');
      }
    });
  });
}

function attachTreeItemListeners() {
  DOM.treeContainer.querySelectorAll('.tree-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const path = item.getAttribute('data-path');
      if (path) {
        e.preventDefault();
        navigateTo(path);
      }
    });
  });
}

export function highlightActiveTreeItem(path) {
  DOM.treeContainer.querySelectorAll('.tree-item').forEach(item => {
    const match = item.getAttribute('data-path') === path;
    item.classList.toggle('active', match);
    if (match) {
      // Expand all parent folders
      let parent = item.closest('.tree-folder');
      while (parent) {
        parent.classList.add('open');
        parent = parent.parentElement ? parent.parentElement.closest('.tree-folder') : null;
      }
      item.scrollIntoView({ block: 'nearest' });
    }
  });
}
