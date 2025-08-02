/* global WebImporter */
export default function parse(element, { document }) {
  // Find the comparison table area
  const table = element.querySelector('ul[role="treegrid"]');
  if (!table) return;

  // Find all rowgroups in the comparison table
  const rowgroups = table.querySelectorAll(':scope > li[role="rowgroup"]');
  if (!rowgroups.length) return;

  // Get the product header row (first rowgroup)
  const productHeaderRow = rowgroups[0].querySelector('ul[role="row"]');
  if (!productHeaderRow) return;

  // The first cell is a blank, the rest are product columns
  const headerCells = Array.from(productHeaderRow.children).slice(1);
  const columnCells = headerCells.map(cell => cell.firstElementChild || cell);
  const numColumns = columnCells.length;

  // The header row must have the same number of columns as the rest, with the block name in the first cell and empty strings for the remainder
  const headerRow = ["Columns (columns32)"];
  while (headerRow.length < numColumns) headerRow.push("");

  // Extract all feature rows (skip the first rowgroup which is headers)
  const featureRows = [];
  for (let i = 1; i < rowgroups.length; i++) {
    const row = rowgroups[i].querySelector('ul[role="row"]');
    if (!row) continue;
    const cells = Array.from(row.children).slice(1).map(cell => cell.firstElementChild || cell);
    // Pad feature row if not enough columns (robust to source variation)
    while (cells.length < numColumns) cells.push("");
    featureRows.push(cells);
  }

  // Build the block table rows
  const blockCells = [
    headerRow,
    columnCells,
    ...featureRows
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(blockCells, document);
  element.replaceWith(block);
}
