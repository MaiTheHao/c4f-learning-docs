/**
 * Cached DOM element references.
 * Safe to resolve at import time: ES modules are deferred until after parsing.
 */

export const DOM = {
  html: document.documentElement,
  sidebar: document.getElementById('sidebar'),
  toggleSidebarBtn: document.getElementById('toggle-sidebar-btn'),
  themeToggleBtn: document.getElementById('theme-toggle-btn'),
  toggleTocBtn: document.getElementById('toggle-toc-btn'),
  tocSidebar: document.getElementById('toc-sidebar'),
  tocNav: document.getElementById('toc-nav'),
  globalSearch: document.getElementById('global-search'),
  categoryTabs: document.getElementById('category-tabs'),
  treeContainer: document.getElementById('tree-container'),
  docCounter: document.getElementById('doc-counter'),
  breadcrumb: document.getElementById('breadcrumb'),
  docCategory: document.getElementById('doc-category'),
  docPathDisplay: document.getElementById('doc-path-display'),
  docTitle: document.getElementById('doc-title'),
  markdownContainer: document.getElementById('markdown-container'),
  loadingState: document.getElementById('loading-state'),
  errorState: document.getElementById('error-state'),
  errorCode: document.getElementById('error-code'),
  errorTitle: document.getElementById('error-title'),
  errorMessage: document.getElementById('error-message'),
  errorPath: document.getElementById('error-path'),
  errorHomeBtn: document.getElementById('error-home-btn'),
  errorRetryBtn: document.getElementById('error-retry-btn'),
  docHeader: document.getElementById('doc-header'),
  backToTopBtn: document.getElementById('back-to-top'),
  contentArea: document.getElementById('content-area'),
  imageModal: document.getElementById('image-modal'),
  modalImg: document.getElementById('modal-img'),
  modalCaption: document.getElementById('modal-caption'),
  modalClose: document.getElementById('modal-close')
};
