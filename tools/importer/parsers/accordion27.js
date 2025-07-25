/* global WebImporter */
export default function parse(element, { document }) {
  // Gather accordion items
  const rows = [];
  const accordionItems = element.querySelectorAll(':scope > .divider');
  accordionItems.forEach((item) => {
    const grid = item.querySelector(':scope > .w-layout-grid');
    if (grid) {
      const children = Array.from(grid.children);
      if (children.length >= 2) {
        rows.push([children[0], children[1]]);
      }
    }
  });

  // Consider direct grids if present for robustness
  const directGrids = Array.from(element.children).filter(e => e.classList.contains('w-layout-grid'));
  directGrids.forEach(grid => {
    const children = Array.from(grid.children);
    if (children.length >= 2) {
      rows.push([children[0], children[1]]);
    }
  });

  // Calculate column count for colspan
  const numCols = rows.length > 0 ? rows[0].length : 2;
  // Create table header cell with correct colspan
  const th = document.createElement('th');
  th.textContent = 'Accordion (accordion27)';
  th.setAttribute('colspan', numCols);
  const headerRow = [th];

  // Compose table data (header row, then data rows)
  const tableData = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
