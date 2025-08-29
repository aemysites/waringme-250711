/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing the CTAs (direct child of the container)
  const grid = element.querySelector(':scope > div');
  let columns = [];
  if (grid) {
    // Each direct child <a> inside grid is a column
    const links = Array.from(grid.querySelectorAll(':scope > a'));
    columns = links.length > 0 ? links : [''];
  } else {
    columns = [''];
  }
  // The header row should have the same number of columns as the columns row, with only the first cell filled
  const headerRow = ['Columns (columns32)'];
  while (headerRow.length < columns.length) {
    headerRow.push('');
  }
  // Build table: header row matches column count of content row
  const cells = [headerRow, columns];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
