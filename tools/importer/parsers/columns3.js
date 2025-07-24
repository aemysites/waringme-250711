/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the grid structure containing columns
  let grid = element.querySelector('.grid-layout');
  if (!grid) {
    const container = element.querySelector('.container');
    grid = container || element;
  }
  // Use direct children of the grid as columns (likely divs)
  const columns = Array.from(grid.children).filter(col => col.nodeType === 1 && (col.textContent.trim().length > 0 || col.querySelector('*')));
  // Table structure: header row (one cell), then one content row with as many columns as found
  const headerRow = ['Columns (columns3)'];
  const cells = [headerRow, columns.length ? columns : ['']];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
