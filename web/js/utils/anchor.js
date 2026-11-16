/** Scroll the reading pane to a heading id / name anchor. */

export function scrollToAnchor(anchorId) {
  if (!anchorId) return;
  const target = document.getElementById(anchorId) ||
                 document.getElementById(decodeURIComponent(anchorId)) ||
                 document.querySelector(`[name="${anchorId}"]`);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
