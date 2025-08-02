/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row as a single cell
  const headerRow = ['Columns (columns36)'];

  // 2. Get the sticky header product columns (skip first li, get inner content only)
  let columnCells = [];
  const stickyHeader = element.querySelector('.sticky__StickyElement-sc-12t29pk-0');
  if (stickyHeader) {
    const headerList = stickyHeader.querySelector('ul.header__HeaderRowElement-sc-jqig4l-1');
    if (headerList) {
      const columnLis = headerList.querySelectorAll(':scope > li');
      // First li is empty header cell, skip it
      for (let i = 1; i < columnLis.length; i++) {
        // Get all children of li as an array
        const cellContent = Array.from(columnLis[i].childNodes);
        columnCells.push(cellContent.length === 1 ? cellContent[0] : cellContent);
      }
    }
  }

  // 3. Gather all data rows (skip first li in each rowgroup for row header, use inner content of <li>)
  const tableRows = [];
  const treegrid = element.querySelector('ul[aria-roledescription="Table"]');
  if (treegrid) {
    const rowgroups = treegrid.querySelectorAll(':scope > li[role="rowgroup"]');
    rowgroups.forEach((rowgroup) => {
      const rowUl = rowgroup.querySelector('ul[role="row"]');
      if (rowUl) {
        const rowLis = rowUl.querySelectorAll(':scope > li');
        // Skip first li (row header)
        let cells = [];
        for (let i = 1; i < rowLis.length; i++) {
          const cellContent = Array.from(rowLis[i].childNodes);
          cells.push(cellContent.length === 1 ? cellContent[0] : cellContent);
        }
        tableRows.push(cells);
      }
    });
  }

  // 4. Assemble rows: first row = header (1 col), second = product columns (n col), following rows = product data (n col)
  const rows = [headerRow];
  if (columnCells.length > 0) {
    rows.push(columnCells);
    tableRows.forEach(row => {
      // Pad if needed (shouldn't be necessary for this markup, but for robustness)
      while (row.length < columnCells.length) {
        row.push(document.createTextNode(''));
      }
      rows.push(row);
    });
  }

  // 5. Create table and replace
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
