/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per requirements (single column)
  const headerRow = ['Columns (columns46)'];

  // Find the main comparison table area (role="treegrid")
  const comparisonTable = element.querySelector('[role="treegrid"]');
  if (!comparisonTable) return;
  const rowGroups = Array.from(comparisonTable.querySelectorAll(':scope > li'));
  if (rowGroups.length === 0) return;

  // The first rowgroup is the header row (with product details)
  const headerRowGroup = rowGroups[0].querySelector('ul');
  const comparisonRows = rowGroups.slice(1).map(rg => rg.querySelector('ul'));

  // Get two main product cells from headerRowGroup (skip first empty li)
  let productCells = [];
  if (headerRowGroup) {
    const lis = Array.from(headerRowGroup.querySelectorAll(':scope > li'));
    if (lis.length >= 3) {
      // Get the internal content of the <li> for each product cell (not the <li> itself)
      productCells = lis.slice(1, 3).map(li => Array.from(li.childNodes));
    }
  }
  if (productCells.length !== 2) return;

  // Now collect comparison rows, each should have 3 li: label, col1, col2
  const rows = [productCells];
  for (const row of comparisonRows) {
    if (!row) continue;
    const lis = Array.from(row.querySelectorAll(':scope > li'));
    if (lis.length === 3) {
      // For each product column, get the content of the <li>
      rows.push([
        Array.from(lis[1].childNodes),
        Array.from(lis[2].childNodes)
      ]);
    }
  }

  // Compose the table: header is a single cell row, then all rows are two cells
  const tableData = [headerRow, ...rows];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
