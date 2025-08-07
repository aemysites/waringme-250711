/* global WebImporter */
export default function parse(element, { document }) {
  // Find the comparison table container
  const tableWrapper = element.querySelector('[data-skyui-core^="ComparisonTable"]');
  if (!tableWrapper) return;
  // Get the main visual table structure
  const treegrid = tableWrapper.querySelector('ul[aria-roledescription="Table"][role="treegrid"]');
  if (!treegrid) return;
  // Get all rowgroups (header and data rows)
  const rowGroups = Array.from(treegrid.querySelectorAll('li[role="rowgroup"]'));
  // Determine the number of columns from the first header row
  let numColumns = 0;
  if (rowGroups.length) {
    const headerRow = rowGroups[0].querySelector('ul[role="row"]');
    if (headerRow) {
      numColumns = headerRow.children.length - 1;
    }
  }
  if (numColumns < 1) return;

  // Helper: Recursively replace any <span data-skyui-core="Markdown@..."> with its children (flatten)
  function removeMarkdownSpans(node) {
    if (!node) return [];
    // If it's a text node, return as is
    if (node.nodeType === Node.TEXT_NODE) {
      return [node];
    }
    // If this is a markdown span, flatten it
    if (node.nodeType === Node.ELEMENT_NODE && node.matches('span[data-skyui-core^="Markdown@"]')) {
      let content = [];
      node.childNodes.forEach(child => {
        content.push(...removeMarkdownSpans(child));
      });
      return content;
    }
    // For all other elements, clone the node and recursively process children
    if (node.nodeType === Node.ELEMENT_NODE) {
      const clone = node.cloneNode(false);
      node.childNodes.forEach(child => {
        removeMarkdownSpans(child).forEach(n => {
          clone.appendChild(n);
        });
      });
      return [clone];
    }
    return [];
  }

  // Helper: For a row, get all cells except the first rowheader cell
  function getRowCells(row) {
    const cells = [];
    for (let i = 1; i < row.children.length; i++) {
      const cell = row.children[i];
      // Unwrap markdown spans and collect childNodes
      let cellContent = [];
      cell.childNodes.forEach(child => {
        cellContent.push(...removeMarkdownSpans(child));
      });
      // Filter out empty text nodes
      cellContent = cellContent.filter(n => {
        return !(n.nodeType === Node.TEXT_NODE && n.textContent.trim() === '');
      });
      if (cellContent.length === 0) {
        cells.push('');
      } else if (cellContent.length === 1) {
        cells.push(cellContent[0]);
      } else {
        cells.push(cellContent);
      }
    }
    return cells;
  }

  // Build rows array
  const cells = [];
  // Header row: MUST be an array with a single string element
  cells.push(['Columns (columns13)']);
  // Column header row
  if (rowGroups.length) {
    const headerRow = rowGroups[0].querySelector('ul[role="row"]');
    if (headerRow) {
      cells.push(getRowCells(headerRow));
    }
  }
  // Data rows
  for (let i = 1; i < rowGroups.length; i++) {
    const row = rowGroups[i].querySelector('ul[role="row"]');
    if (!row) continue;
    const rowCells = getRowCells(row);
    while (rowCells.length < numColumns) rowCells.push('');
    cells.push(rowCells);
  }

  // Create table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Set colspan for block name header
  if (numColumns > 1) {
    const firstRow = table.rows[0];
    if (firstRow && firstRow.cells.length === 1) {
      firstRow.cells[0].setAttribute('colspan', numColumns);
    }
  }
  element.replaceWith(table);
}
