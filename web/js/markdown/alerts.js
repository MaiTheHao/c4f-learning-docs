/**
 * GitHub-flavored alert callouts.
 * Transforms `> [!NOTE] ...` blockquotes into styled alert blocks.
 */

const ALERT_ICONS = {
  note: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path></svg>`,
  tip: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.604-.72-1.396-1.664-1.396-3.279C2.7 1.77 4.9 0 8 0s5.3 1.77 5.3 4.25c0 1.615-.792 2.56-1.396 3.28a8.456 8.456 0 0 0-.542.68c-.207.3-.33.565-.37.847a.75.75 0 0 1-1.484-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM6 11.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5h-2.5Z"></path></svg>`,
  important: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H9.06l-2.573 2.573A1.458 1.458 0 0 1 4 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>`,
  warning: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>`,
  caution: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4.47.047A1.75 1.75 0 0 1 5.71 0h4.58c.464 0 .909.184 1.237.513l3.96 3.96c.329.328.513.773.513 1.237v4.58c0 .464-.184.909-.513 1.237l-3.96 3.96a1.75 1.75 0 0 1-1.237.513H5.71a1.75 1.75 0 0 1-1.237-.513l-3.96-3.96A1.75 1.75 0 0 1 0 10.29V5.71c0-.464.184-.909.513-1.237l3.96-3.96ZM5.71 1.5a.25.25 0 0 0-.177.073L1.573 5.534a.25.25 0 0 0-.073.176v4.58c0 .066.026.13.073.177l3.96 3.96c.047.047.111.073.177.073h4.58a.25.25 0 0 0 .177-.073l3.96-3.96a.25.25 0 0 0 .073-.177V5.71a.25.25 0 0 0-.073-.177L9.884 1.573A.25.25 0 0 0 9.707 1.5Zm2.79 3.25v3.5a.75.75 0 0 1-1.5 0v-3.5a.75.75 0 0 1 1.5 0ZM9 10.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>`
};

export function transformAlerts(container) {
  const blockquotes = container.querySelectorAll('blockquote');

  blockquotes.forEach(bq => {
    const firstP = bq.querySelector('p');
    if (!firstP) return;

    const match = firstP.innerHTML.match(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(<br\s*\/?>)?\s*/i);
    if (match) {
      const type = match[1].toLowerCase();
      firstP.innerHTML = firstP.innerHTML.replace(match[0], '');
      bq.classList.add('gh-alert', `gh-alert-${type}`);

      const titleDiv = document.createElement('div');
      titleDiv.className = 'gh-alert-title';
      titleDiv.innerHTML = `${ALERT_ICONS[type] || ''} <span>${type.toUpperCase()}</span>`;
      bq.insertBefore(titleDiv, bq.firstChild);
    }
  });
}
