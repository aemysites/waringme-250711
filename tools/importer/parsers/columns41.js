/* global WebImporter */
export default function parse(element, { document }) {
  // Find the list containing the columns
  const columnsList = element.querySelector('ul');
  if (!columnsList) return;
  const columnItems = Array.from(columnsList.children);

  // Extract contents for each column
  const columns = columnItems.map((li) => {
    const grid = li.querySelector('[class^="grid__Grid"]');
    if (!grid) return [li]; // fallback, pass li if grid is missing
    const img = grid.querySelector('img');
    const label = grid.querySelector('p');
    let desc;
    const descDiv = grid.querySelector('div');
    if (descDiv) {
      desc = descDiv.querySelector('p');
    }
    const parts = [];
    if (img) parts.push(img);
    if (label) parts.push(label);
    if (desc) parts.push(desc);
    return parts;
  });

  // Header row must be an array with a single cell (one string)
  // The block name must match the example exactly
  const headerRow = ['Columns (columns41)'];
  // Content row has as many columns as needed
  const tableCells = [headerRow, columns];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);

  element.replaceWith(table);
}
