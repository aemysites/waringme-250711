/* global WebImporter */
export default function parse(element, { document }) {
  // Find the ul containing the li's for columns
  const ul = element.querySelector('ul');
  if (!ul) return;
  const lis = Array.from(ul.children).filter(li => li.tagName === 'LI');

  // Each li > div > div > div.grid__Grid-sc-ysk8de-0 (contains img + p)
  // but for more robustness, include the whole li > div[data-test-id] as the column cell
  const columns = lis.map(li => {
    // The outer box for this column (contains all content for that column)
    // This is div[data-test-id^=rtbs-single-]
    const box = li.querySelector('div[data-test-id^="rtbs-single-"]');
    // Fallback to li if box not found
    return box || li;
  });

  // Compose the table: header, then a row with one cell per column
  const cells = [
    ['Columns (columns12)'],
    columns
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
