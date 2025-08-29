/* global WebImporter */
export default function parse(element, { document }) {
  // Columns (columns3) block header
  const headerRow = ['Columns (columns3)'];

  // Find the <ul> list that contains the columns
  const ul = element.querySelector('ul');
  let columnCells = [];
  if (ul) {
    // Only immediate li children (columns)
    columnCells = Array.from(ul.children).map(li => {
      // Each li represents a column block
      // Find the grid element for content
      const grid = li.querySelector('[class*=grid__Grid]');
      if (grid) {
        // In each grid: img, first p (title), second p (desc) possibly in div
        const img = grid.querySelector('img');
        const ps = grid.querySelectorAll('p');
        const content = [];
        if (img) content.push(img);
        if (ps[0]) content.push(ps[0]);
        if (ps[1]) content.push(ps[1]);
        return content;
      }
      // If grid structure is missing, just return the whole li
      return [li];
    });
  }

  // If no ul (edge case), try to extract child divs as columns
  if (!ul) {
    // Attempt to fallback to direct child divs for columns
    const topDivs = element.querySelectorAll(':scope > div > div > div > div > ul > li');
    if (topDivs.length > 0) {
      columnCells = Array.from(topDivs).map(li => [li]);
    }
  }

  // Only add the columns row if there is column data
  const cells = [headerRow];
  if (columnCells.length > 0) {
    cells.push(columnCells);
  }

  // Create and replace the block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
