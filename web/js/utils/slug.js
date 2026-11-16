/** Heading slug generator (keeps Vietnamese diacritics). */

export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\u00C0-\u1EF9\- ]+/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
