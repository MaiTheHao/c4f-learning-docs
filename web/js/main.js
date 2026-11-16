/**
 * Markdown Docs Reviewer - application entry point.
 * Pure static, zero build tools, native ES modules.
 *
 * This file is the ONLY composition root: it wires concrete UI and markdown
 * modules into the abstract seams exposed by core/router.js and ui/theme.js.
 */

import { DOM } from './core/dom.js';
import { state } from './core/state.js';
import { initRouter, parseHashRoute, navigateTo } from './core/router.js';
import { loadManifest } from './services/manifest.js';
import { getDocumentText } from './services/documents.js';
import { initTheme, setThemeChangeHandler } from './ui/theme.js';
import { renderFileTree, highlightActiveTreeItem } from './ui/tree.js';
import { updateBreadcrumb } from './ui/breadcrumb.js';
import { initLightbox } from './ui/lightbox.js';
import { initErrorView, showError, hideError } from './ui/error-view.js';
import { initShell } from './ui/shell.js';
import { renderMarkdown } from './markdown/renderer.js';
import { renderMermaidDiagrams } from './markdown/mermaid.js';

const HOME_DOC_PATH = 'release/README.md';

async function loadDocument(docPath, targetAnchor = '') {
  if (!docPath) return;

  state.currentDocPath = docPath;
  highlightActiveTreeItem(docPath);
  updateBreadcrumb(docPath);

  hideError();
  DOM.loadingState.style.display = 'flex';
  DOM.markdownContainer.innerHTML = '';

  try {
    const markdownText = await getDocumentText(docPath);
    renderMarkdown(markdownText, docPath, targetAnchor);
  } catch (err) {
    showError(err, docPath);
  }
}

async function init() {
  initTheme();
  setThemeChangeHandler(renderMermaidDiagrams);
  initLightbox();
  initShell();
  initErrorView({
    onHome: () => navigateTo(HOME_DOC_PATH),
    onRetry: () => loadDocument(state.currentDocPath)
  });
  initRouter(loadDocument);

  await loadManifest(renderFileTree);

  const initialRoute = parseHashRoute();
  loadDocument(initialRoute.path, initialRoute.anchor);
}

init();
