/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row is always a single cell/column matching the block name
  const headerRow = ['Columns (columns5)'];

  // 2. Find the ticker items from the ul > li in the flex container
  let tickerItems = [];
  const flexDiv = element.querySelector('.flex__Flex-sc-1r1ee79-0');
  if (flexDiv) {
    const ul = flexDiv.querySelector('ul');
    if (ul && ul.children.length > 0) {
      tickerItems = Array.from(ul.children).map((li) => {
        // Reference the entire li content as a vertical block for the column
        // We'll use a wrapper div for safety and stability
        const wrapper = document.createElement('div');
        while (li.firstChild) {
          wrapper.appendChild(li.firstChild);
        }
        return wrapper;
      });
    }
  }

  // 3. Only build the rows if columns exist, else fallback
  if (tickerItems.length === 0) {
    tickerItems = [''];
  }

  // 4. Compose the table rows: header is always a single column, next row is one cell per column
  const rows = [headerRow, tickerItems];
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
