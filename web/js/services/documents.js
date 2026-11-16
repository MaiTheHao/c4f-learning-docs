/**
 * Markdown document fetching with an in-memory cache.
 * Paths are repo-root-relative (e.g. "release/security/jwt/intro.md").
 *
 * Every failure is surfaced as a DocumentError so the UI can pick an
 * appropriate error page: not-found / server / network / unknown.
 */

import { state } from '../core/state.js';
import { resolveStaticAssetUrl } from '../core/paths.js';

export class DocumentError extends Error {
  /**
   * @param {'not-found'|'server'|'network'|'unknown'} kind
   * @param {string} message
   * @param {string} docPath
   * @param {number} [status]
   */
  constructor(kind, message, docPath, status = 0) {
    super(message);
    this.name = 'DocumentError';
    this.kind = kind;
    this.docPath = docPath;
    this.status = status;
  }
}

export async function getDocumentText(docPath) {
  const cached = state.cache.get(docPath);
  if (cached) {
    return cached;
  }

  let res;
  try {
    res = await fetch(resolveStaticAssetUrl(docPath));
  } catch (err) {
    throw new DocumentError('network', err.message || 'Không kết nối được tới máy chủ', docPath);
  }

  if (!res.ok) {
    if (res.status === 404) {
      throw new DocumentError('not-found', `Không tìm thấy tài liệu "${docPath}"`, docPath, 404);
    }
    throw new DocumentError('server', `Máy chủ trả về HTTP ${res.status}`, docPath, res.status);
  }

  // Guard: unknown paths fall back to web/index.html with 200 + text/html,
  // so a successful status alone does not mean the document exists.
  const contentType = (res.headers.get('content-type') || '').toLowerCase();
  if (contentType.includes('text/html')) {
    throw new DocumentError('not-found', `Không tìm thấy tài liệu "${docPath}"`, docPath, 404);
  }

  const markdownText = await res.text();
  state.cache.set(docPath, markdownText);
  return markdownText;
}
