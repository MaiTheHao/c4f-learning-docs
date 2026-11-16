/**
 * Hash router.
 * Route format: #<docPath>[#<anchor>] - e.g. #release/security/jwt/intro.md#cau-truc-jwt
 * The loader is injected by main.js so this module stays free of rendering concerns.
 */

import { state } from './state.js';

const DEFAULT_DOC_PATH = 'release/README.md';

let routeHandler = null;

export function parseHashRoute() {
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash) {
    return { path: DEFAULT_DOC_PATH, anchor: '' };
  }

  // Support #path/to/file.md#anchor-name
  const secondHashIdx = hash.indexOf('#');
  if (secondHashIdx !== -1) {
    return {
      path: hash.substring(0, secondHashIdx),
      anchor: hash.substring(secondHashIdx + 1)
    };
  }
  return { path: hash, anchor: '' };
}

export function navigateTo(path, anchor = '') {
  const fullHash = `#${path}${anchor ? '#' + anchor : ''}`;
  if (window.location.hash === fullHash) {
    if (routeHandler) routeHandler(path, anchor);
  } else {
    window.location.hash = fullHash;
  }
}

/** Push an in-document anchor for the currently open document into history. */
export function pushDocAnchor(anchor) {
  if (!anchor) return;
  history.pushState(null, '', `#${state.currentDocPath}#${anchor}`);
}

export function initRouter(handler) {
  routeHandler = handler;
  window.addEventListener('hashchange', () => {
    const route = parseHashRoute();
    if (routeHandler) routeHandler(route.path, route.anchor);
  });
}
