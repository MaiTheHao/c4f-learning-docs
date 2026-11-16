/** Image lightbox modal. */

import { DOM } from '../core/dom.js';

export function openLightbox(src, alt) {
  DOM.modalImg.src = src;
  DOM.modalCaption.textContent = alt;
  DOM.imageModal.style.display = 'flex';
}

export function closeLightbox() {
  DOM.imageModal.style.display = 'none';
  DOM.modalImg.src = '';
}

export function initLightbox() {
  DOM.modalClose.addEventListener('click', closeLightbox);
  DOM.imageModal.addEventListener('click', (e) => {
    if (e.target === DOM.imageModal) {
      closeLightbox();
    }
  });
}
