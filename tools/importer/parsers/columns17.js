/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid that represents the columns structure
  const grid = element.querySelector('.grid-layout, .w-layout-grid');
  if (!grid) return;

  // Get all direct children of the grid (these represent each column)
  const columns = Array.from(grid.children);
  if (!columns.length) return;

  // Table header must be EXACTLY one cell with block name
  const cells = [
    ['Columns (columns17)']
  ];

  // Second row: one cell per column (side by side)
  cells.push(columns);

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the columns block
  element.replaceWith(block);
}
