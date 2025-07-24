/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main grid layout - columns container
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;

  // Get all direct child columns (div or ul) of the grid
  const cols = Array.from(grid.children);
  if (!cols.length) return;

  // Header row: must be a single column, even if there are multiple content columns
  const headerRow = ['Columns (columns9)'];

  // Second row: each cell is the referenced column block
  const contentRow = cols;

  // Build the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,      // single cell header row
    contentRow      // content row with n columns
  ], document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
