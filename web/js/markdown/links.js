/**
 * Markdown link & media rewriting.
 * Relative image paths become root-absolute URLs; relative .md links are
 * converted to hash routes and intercepted so the app never reloads.
 */

import { state } from '../core/state.js';
import { resolveRelativePath, resolveStaticAssetUrl } from '../core/paths.js';
import { navigateTo, pushDocAnchor } from '../core/router.js';
import { scrollToAnchor } from '../utils/anchor.js';
import { openLightbox } from '../ui/lightbox.js';

export function resolveImageAndMediaPaths(container, docDir) {
  const images = container.querySelectorAll('img');
  images.forEach(img => {
    const rawSrc = img.getAttribute('src');
    if (!rawSrc) return;

    // Skip external or inline data images
    if (/^(https?:|\/\/|data:|blob:)/i.test(rawSrc)) {
      return;
    }

    const resolvedRelPath = resolveRelativePath(docDir, rawSrc);
    const finalUrl = resolveStaticAssetUrl(resolvedRelPath);
    img.src = finalUrl;

    // Lightbox click handler
    img.addEventListener('click', () => {
      openLightbox(finalUrl, img.getAttribute('alt') || '');
    });

    // Handle image load error gracefully
    img.addEventListener('error', () => {
      img.style.border = '2px dashed #da3633';
      img.title = `Không thể nạp ảnh từ: ${finalUrl}`;
    });
  });
}

export function interceptInternalLinks(container, docDir) {
  const links = container.querySelectorAll('a');
  links.forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;

    // Case 1: In-page anchor link (#section)
    if (href.startsWith('#')) {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSlug = href.substring(1);
        scrollToAnchor(targetSlug);
        pushDocAnchor(targetSlug);
      });
      return;
    }

    // Case 2: External Link (http/https/mailto)
    if (/^(https?:|\/\/|mailto:|tel:)/i.test(href)) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      return;
    }

    // Case 3: Relative Markdown Link (.md)
    const [pathPart, anchorPart] = href.split('#');
    if (pathPart.toLowerCase().endsWith('.md') || pathPart.endsWith('/')) {
      const resolvedDocPath = resolveRelativePath(docDir, pathPart);

      a.href = `#${resolvedDocPath}${anchorPart ? '#' + anchorPart : ''}`;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(resolvedDocPath, anchorPart || '');
      });
    }
  });
}
