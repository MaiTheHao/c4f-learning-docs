/**
 * Path resolution.
 * Documents are stored repo-root-relative (e.g. "release/security/jwt/intro.md")
 * while the app may be served from "/" (Vercel) or "/web/" (plain HTTP server).
 */

export function getRepoRootPrefix() {
  const path = window.location.pathname;
  if (path.includes('/web/') || path.endsWith('/web')) {
    return '../';
  }
  return './';
}

export function resolveStaticAssetUrl(relativePathFromRepoRoot) {
  const cleanPath = relativePathFromRepoRoot.replace(/^\/+/, '');
  return getRepoRootPrefix() + cleanPath;
}

export function resolveRelativePath(baseDir, relativePath) {
  if (!relativePath || /^(https?:|\/\/|data:|blob:|\/)/i.test(relativePath)) {
    return relativePath;
  }

  const baseParts = baseDir ? baseDir.split('/').filter(Boolean) : [];
  const relParts = relativePath.split('/').filter(Boolean);

  for (const part of relParts) {
    if (part === '.') {
      continue;
    } else if (part === '..') {
      if (baseParts.length > 0) {
        baseParts.pop();
      }
    } else {
      baseParts.push(part);
    }
  }
  return baseParts.join('/');
}
