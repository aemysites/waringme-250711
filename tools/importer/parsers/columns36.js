/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main comparison table root (element with role="treegrid")
  const tableRoot = element.querySelector('[role="treegrid"]');
  if (!tableRoot) return;

  // Get the column headers from the table header row (skip first/label column)
  const headerGroup = tableRoot.querySelector('.header__HeaderGroupElement-sc-jqig4l-0');
  const headerRow = headerGroup ? headerGroup.querySelector('[role="row"]') : null;
  if (!headerRow) return;
  const headerCells = Array.from(headerRow.children);
  // The first cell in the row is for labels, skip it
  const productCells = headerCells.slice(1).map(cell => {
    // Use cell's content directly
    return cell.firstElementChild ? cell.firstElementChild : cell;
  });

  // Build the block rows: header (single cell), then product row, then features rows
  const blockRows = [];
  blockRows.push(['Columns (columns36)']);
  blockRows.push(productCells);

  // Now process the feature rows
  const rowGroups = tableRoot.querySelectorAll('.row__RowGroupElement-sc-1hc13bq-1, .gvIDkC');
  rowGroups.forEach(rowGroup => {
    const row = rowGroup.querySelector('[role="row"]');
    if (!row) return;
    const rowCells = Array.from(row.children);
    // skip the first cell (label), take the rest
    const featureCells = rowCells.slice(1).map(cell => cell.firstElementChild ? cell.firstElementChild : cell);
    blockRows.push(featureCells);
  });

  // Create the table with correct header structure
  const block = WebImporter.DOMUtils.createTable(blockRows, document);
  element.replaceWith(block);
}
