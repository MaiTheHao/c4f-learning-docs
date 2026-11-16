/**
 * Application shell interactions: panel toggles, category tabs,
 * global search input, back-to-top button and keyboard shortcuts.
 */

import { state } from '../core/state.js';
import { DOM } from '../core/dom.js';
import { renderFileTree } from './tree.js';
import { closeLightbox } from './lightbox.js';

function initPanelToggles() {
  DOM.toggleSidebarBtn.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      DOM.sidebar.classList.toggle('open');
    } else {
      DOM.sidebar.classList.toggle('collapsed');
    }
  });

  DOM.toggleTocBtn.addEventListener('click', () => {
    if (window.innerWidth <= 1100) {
      DOM.tocSidebar.classList.toggle('open');
    } else {
      DOM.tocSidebar.classList.toggle('collapsed');
    }
  });
}

function initCategoryTabs() {
  DOM.categoryTabs.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      DOM.categoryTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeCategory = btn.getAttribute('data-cat') || 'all';
      renderFileTree();
    });
  });
}

function initSearchInput() {
  DOM.globalSearch.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.trim();
    renderFileTree();
  });
}

function initBackToTop() {
  DOM.contentArea.addEventListener('scroll', () => {
    if (DOM.contentArea.scrollTop > 300) {
      DOM.backToTopBtn.classList.add('visible');
    } else {
      DOM.backToTopBtn.classList.remove('visible');
    }
  });

  DOM.backToTopBtn.addEventListener('click', () => {
    DOM.contentArea.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === '/' && document.activeElement !== DOM.globalSearch) {
      e.preventDefault();
      DOM.globalSearch.focus();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      DOM.sidebar.classList.toggle('collapsed');
    }
  });
}

export function initShell() {
  initPanelToggles();
  initCategoryTabs();
  initSearchInput();
  initBackToTop();
  initKeyboardShortcuts();
}
