/**
 * Manifest loading.
 * `web/manifest.js` (window.DOCS_MANIFEST) is preferred so the tree renders
 * without an extra round-trip; `web/manifest.json` is the fallback.
 */

import { state } from '../core/state.js';
import { DOM } from '../core/dom.js';
import { resolveStaticAssetUrl } from '../core/paths.js';

export async function loadManifest(onLoaded) {
  if (window.DOCS_MANIFEST && Array.isArray(window.DOCS_MANIFEST) && window.DOCS_MANIFEST.length > 0) {
    state.manifest = window.DOCS_MANIFEST;
    onLoaded();
    return;
  }

  try {
    const res = await fetch(resolveStaticAssetUrl('web/manifest.json'));
    if (res.ok) {
      state.manifest = await res.json();
      onLoaded();
    } else {
      throw new Error('Không thể tải manifest.json');
    }
  } catch (err) {
    console.warn('Fetch manifest.json error, using empty tree:', err);
    DOM.docCounter.textContent = '0 tài liệu';
  }
}
