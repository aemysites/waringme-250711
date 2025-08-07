/* global WebImporter */
export default function parse(element, { document }) {
  // Step 1: Extract the columns from the <ul> if present
  const ul = element.querySelector('ul');
  let columnCells = [];
  if (ul) {
    const lis = ul.querySelectorAll(':scope > li');
    columnCells = Array.from(lis).map(li => {
      const grid = li.querySelector('[data-skyui-core^="Grid"]');
      if (grid) {
        const img = grid.querySelector('img');
        const p = grid.querySelector('p');
        let cellContent = [];
        if (img) cellContent.push(img);
        if (p) cellContent.push(p);
        return cellContent.length === 1 ? cellContent[0] : cellContent;
      }
      return li;
    });
  }
  if (columnCells.length === 0) return;

  // Create header row with single cell (so header is not spread across columns)
  const headerRow = ['Columns (columns23)'];

  // Compose table rows as required: header (1 cell), then columns as N cells
  const rows = [headerRow, columnCells];
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
