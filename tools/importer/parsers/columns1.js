/* global WebImporter */
export default function parse(element, { document }) {
  // The block table header as per spec
  const headerRow = ['Columns (columns1)'];

  // Find the grid with the columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get the direct children of the grid, these are the columns
  const columns = Array.from(grid.children);

  // Compose the table with the block header and the column cells
  // Each cell is the column's content (referenced directly)
  const cells = [headerRow, columns];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
