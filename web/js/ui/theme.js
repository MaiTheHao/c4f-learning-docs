/**
 * Theme management (dark / light) with persistence.
 * Mermaid re-rendering is injected by main.js to avoid importing the
 * markdown layer from the UI layer.
 */

import { state } from '../core/state.js';
import { DOM } from '../core/dom.js';

let onThemeChanged = null;

/** @param {(container: HTMLElement) => Promise<void>} fn */
export function setThemeChangeHandler(fn) {
  onThemeChanged = fn;
}

export function applyTheme(theme) {
  state.theme = theme;
  DOM.html.setAttribute('data-theme', theme);
  localStorage.setItem('docs_theme', theme);

  if (window.mermaid) {
    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: theme === 'dark' ? 'dark' : 'default',
        securityLevel: 'loose'
      });
    } catch (e) {
      console.warn('Mermaid re-init error', e);
    }
  }
}

export function initTheme() {
  applyTheme(state.theme);
  DOM.themeToggleBtn.addEventListener('click', () => {
    applyTheme(state.theme === 'dark' ? 'light' : 'dark');
    // Re-render mermaid diagrams if active
    if (DOM.markdownContainer.querySelector('.mermaid') && onThemeChanged) {
      onThemeChanged(DOM.markdownContainer);
    }
  });
}
