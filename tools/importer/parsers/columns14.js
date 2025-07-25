/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid-layout containing the columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get all direct children of the grid as columns
  const columns = Array.from(grid.children);
  if (!columns.length) return;

  // Table header: single cell as in the example
  const headerRow = ['Columns (columns14)'];

  // Table content row: one cell per column, as in the example
  // The example shows that the content row has as many cells as columns in the grid
  const contentRow = columns.map(col => col);

  // Combine into cells array
  const cells = [headerRow, contentRow];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
