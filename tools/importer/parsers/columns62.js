/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block, as per the example
  const headerRow = ['Columns (columns62)'];

  // Find the columns list (ul)
  const ul = element.querySelector('ul');
  let maxRowCount = 0;
  let columns = [];

  if (ul) {
    // Get all direct li children (columns)
    const lis = Array.from(ul.querySelectorAll(':scope > li'));
    lis.forEach((li) => {
      // For each li, find the grid containing the content
      const grid = li.querySelector('[data-skyui-core^="Grid@"]');
      let cellRows = [];
      if (grid) {
        // Gather img, main text, subtext as separate rows (to match possible example structure)
        const img = grid.querySelector('img');
        const mainText = grid.querySelector('p.text__TextElement-sc-qf7y4e-0.fEbVZQ');
        const subText = grid.querySelector('div.sc-ckdEwu.lmnttp p');
        let content = [];
        if (img) content.push(img);
        if (mainText) content.push(mainText);
        if (subText) content.push(subText);
        cellRows = content;
      } else {
        // fallback: just use the li
        cellRows = [li];
      }
      columns.push(cellRows);
      if (cellRows.length > maxRowCount) maxRowCount = cellRows.length;
    });
  }

  // Normalize columns so all have the same number of rows (fill with empty if missing)
  columns = columns.map(col => {
    if (col.length < maxRowCount) {
      return col.concat(Array(maxRowCount - col.length).fill(''));
    }
    return col;
  });

  // Build rows: first row is header, next maxRowCount rows as columns
  const tableRows = [headerRow];
  for (let rowIdx = 0; rowIdx < maxRowCount; rowIdx++) {
    const row = columns.map(col => col[rowIdx]);
    tableRows.push(row);
  }

  // Create and replace the block
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
