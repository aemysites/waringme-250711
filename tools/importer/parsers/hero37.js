/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block table
  const headerRow = ['Hero (hero37)'];

  // Second row: Background image (not present in HTML, so empty)
  const backgroundRow = [''];

  // Third row: capture the main headline and any other content, if present
  // For this HTML, the only visible content is the h2 ("Why Sky?")
  // We want to preserve any structure (e.g. <h2>, <span>, etc.)
  // Find the heading (h2) within the element
  const h2 = element.querySelector('h2');
  let contentCell;
  if (h2) {
    contentCell = h2;
  } else {
    // fallback: empty cell if nothing present
    contentCell = '';
  }

  const cells = [
    headerRow,
    backgroundRow,
    [contentCell]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
