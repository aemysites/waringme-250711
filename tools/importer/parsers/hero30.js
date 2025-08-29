/* global WebImporter */
export default function parse(element, { document }) {
  // The block expects: 1 column, 3 rows
  // [ 'Hero (hero30)' ]
  // [ image (optional) ]
  // [ headline, subheading, CTA (optional) ]

  // Get immediate children only
  const children = Array.from(element.children);
  // Find any image child (for background/top image)
  let imgEl = null;
  // Gather everything else for the bottom cell (headline, subheading, etc.)
  const contentEls = [];

  for (const child of children) {
    if (!imgEl && child.tagName === 'IMG') {
      imgEl = child;
    } else {
      // Only include non-empty elements
      if (child.textContent.trim() || child.tagName.match(/^H[1-6]$/) || child.tagName === 'A') {
        contentEls.push(child);
      }
    }
  }

  // If there is no additional content, ensure row is not empty
  const contentCell = contentEls.length > 0 ? contentEls : [''];

  const rows = [
    ['Hero (hero30)'],
    [imgEl ? imgEl : ''],
    [contentCell]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
