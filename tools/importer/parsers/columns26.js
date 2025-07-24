/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid layout container
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get direct children (columns)
  const columns = Array.from(grid.children);
  if (columns.length < 2) return;

  // Use the left column (text) and right column (image) directly as cells
  const leftCol = columns[0];
  const rightCol = columns[1];

  // Build table structure
  const headerRow = ['Columns (columns26)'];
  const secondRow = [leftCol, rightCol];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    secondRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
