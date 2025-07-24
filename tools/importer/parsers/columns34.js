/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid-layout inside the container
  const grid = element.querySelector('.container .grid-layout');
  if (!grid) return;

  // Get all immediate children of the grid (these are the columns)
  const columns = Array.from(grid.children);
  
  // The header row must be a single cell/column, per spec
  const headerRow = ['Columns (columns34)'];

  // The second row: one cell per column, referencing each existing element directly
  const contentRow = columns;

  // Compose the cells array: header is a single column, content row(s) as wide as necessary
  const cells = [headerRow, contentRow];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
