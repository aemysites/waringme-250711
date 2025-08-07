/* global WebImporter */
export default function parse(element, { document }) {
  // Find the <ul> for the columns
  const ul = element.querySelector('ul');
  if (!ul) return;
  const lis = Array.from(ul.children);

  // Gather content for each column
  const columns = lis.map(li => {
    const grid = li.querySelector('[data-skyui-core^="Grid"]') || li;
    const img = grid.querySelector('img');
    const ps = grid.querySelectorAll('p');
    const content = [];
    if (img) content.push(img);
    if (ps[0]) content.push(ps[0]);
    if (ps[1]) content.push(ps[1]);
    return content;
  });

  // As per requirement: header row must be a single cell
  // The next row contains as many columns as needed
  const tableData = [
    ['Columns (columns60)'],
    columns
  ];

  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
