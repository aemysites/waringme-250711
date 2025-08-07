/* global WebImporter */
export default function parse(element, { document }) {
  // According to the example, header row must be a single cell
  // and subsequent row must have one cell per column

  // Find the UL containing the column LI elements
  const ul = element.querySelector('ul');
  if (!ul) return;
  const lis = Array.from(ul.children);

  // For each LI, find the innermost content wrapper for the column
  const columns = lis.map((li) => {
    let content = li.querySelector('.grid__Grid-sc-ysk8de-0');
    return content || li;
  });

  // Construct the table: header row (one cell), then columns row
  const tableRows = [];
  tableRows.push(['Columns (columns29)']); // Header row: must be ONE cell
  tableRows.push(columns); // Columns row: one cell per column

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
