/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the grid with direct column contents
  const grid = element.querySelector('[data-test-id="play-like-a-pro-ctas-grid"]');
  let columns = [];
  if (grid) {
    columns = Array.from(grid.children);
  } else {
    columns = Array.from(element.children);
  }

  // 2. Compose the table data: header row is always a single column
  // Second row: one cell per column
  const cells = [
    ['Columns (columns56)'],
    columns
  ];

  // 3. Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
