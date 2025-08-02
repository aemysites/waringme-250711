/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: exactly one cell
  const headerRow = ['Columns (columns23)'];

  // Find the <ul> containing the columns
  const ul = element.querySelector('ul');
  let columns = [];
  if (ul) {
    const lis = Array.from(ul.children);
    columns = lis.map(li => {
      // Try to get the grid div in each li
      const gridDiv = li.querySelector('[data-skyui-core^="Grid@"], .grid__Grid-sc-ysk8de-0');
      return gridDiv || li;
    });
  }

  // Only create table if we have columns
  if (columns.length > 0) {
    // Structure: first row = headerRow (single cell), second row = columns (one per cell)
    const tableArr = [headerRow, columns];
    const table = WebImporter.DOMUtils.createTable(tableArr, document);
    element.replaceWith(table);
  }
}