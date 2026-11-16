/**
 * Application state container (single source of truth).
 * Plain object - mutations are explicit at the call site.
 */

export const state = {
  currentDocPath: '',
  activeCategory: 'all',
  searchQuery: '',
  manifest: [],
  cache: new Map(),
  theme: localStorage.getItem('docs_theme') || 'dark',
  sidebarOpen: true,
  tocOpen: true
};
