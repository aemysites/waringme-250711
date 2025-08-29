/* global WebImporter */
export default function parse(element, { document }) {
  // Build the table header
  const headerRow = ['Columns (columns34)'];
  const tableRows = [headerRow];

  // Get all immediate child divs, each representing a row
  const rowDivs = Array.from(element.querySelectorAll(':scope > div'));
  if (rowDivs.length === 0) {
    // If there are no rows, just output the header
    const block = WebImporter.DOMUtils.createTable([headerRow], document);
    element.replaceWith(block);
    return;
  }

  rowDivs.forEach(rowDiv => {
    // Each child of this row div is a column cell
    const columnNodes = Array.from(rowDiv.children);
    // For each column, gather all its children (to be flexible for text, lists, etc.)
    const cells = columnNodes.map(colEl => {
      // If column has only 1 child, just reference it directly
      if (colEl.children.length === 0) {
        return colEl;
      } else {
        // Otherwise, gather all child nodes
        return Array.from(colEl.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim() !== ''));
      }
    });
    // If there are no child columns (odd markup), try to use direct children (like images only)
    if (cells.length === 0) {
      // fallback: treat each direct child (likely image) as a column
      const fallbackCells = Array.from(rowDiv.childNodes).filter(n => n.nodeType === 1);
      if (fallbackCells.length) {
        tableRows.push(fallbackCells);
      } else {
        tableRows.push(['']);
      }
    } else {
      tableRows.push(cells);
    }
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
