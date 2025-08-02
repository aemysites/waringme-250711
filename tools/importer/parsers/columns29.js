/* global WebImporter */
export default function parse(element, { document }) {
  // Find the list of columns (li elements)
  const ul = element.querySelector('ul');
  let items = [];
  if (ul) {
    items = Array.from(ul.children);
  }

  // For each li, extract the main content wrapper (Box) or fallback to li if missing
  const cols = items.map(li => {
    const box = li.querySelector('div[data-skyui-core^="Box"]');
    return box || li;
  });

  // Ensure we produce a table with a single header cell spanning all columns
  if (cols.length > 0) {
    const headerRow = ['Columns (columns29)']; // single cell header row
    const rows = [headerRow, cols]; // second row is array of columns (one cell per column)
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
