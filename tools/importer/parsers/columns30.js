/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid that contains the columns
  let grid = null;
  // Typically: section > div.centered > div.w-layout-grid
  const centered = element.querySelector(':scope > .centered, :scope > div.centered') || element.querySelector(':scope > div');
  if (centered) {
    grid = centered.querySelector(':scope > .w-layout-grid, :scope > div.w-layout-grid') || centered.querySelector(':scope > div');
  } else {
    grid = element.querySelector('.w-layout-grid, div');
  }
  if (!grid) return;

  // Each column is a direct child of grid
  const columnDivs = Array.from(grid.children).filter(child => child.nodeType === 1);

  // For each column, gather ALL content inside that column
  // (including images, text, buttons, etc.)
  const columnCells = columnDivs.map(col => {
    // Collect all children of the column (not just images)
    // Flatten nested structure if needed
    const children = Array.from(col.children);
    // If there is only one wrapper child (e.g., aspect ratio div), and it contains more children, use those instead
    if (children.length === 1 && children[0].children.length > 0) {
      return Array.from(children[0].children);
    }
    // Otherwise, use all immediate children (could be empty, returns [])
    return children.length ? children : [col];
  });

  // Compose the columns block table
  // Header row: exactly one cell
  const cells = [
    ['Columns (columns30)'],
    columnCells
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
