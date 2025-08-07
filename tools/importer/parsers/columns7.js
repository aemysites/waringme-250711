/* global WebImporter */
export default function parse(element, { document }) {
  // Find the <ul> that contains the columns
  const ul = element.querySelector('ul');
  if (!ul) return;
  const lis = Array.from(ul.children).filter(el => el.tagName === 'LI');

  // Each <li> holds a single column's content
  const columns = lis.map(li => {
    // Typically the content is inside the box__Box element
    const box = li.querySelector('div[data-skyui-core^="Box@"]');
    return box || li;
  });

  // The header must be a single column
  const headerRow = ['Columns (columns7)'];

  // For correct structure: header is single column, then next row is N columns
  // To achieve this, build a two-row table: first row single cell, second row as many columns as needed
  const rows = [
    headerRow,
    columns // this row will be split into N columns by createTable
  ];

  // The createTable will handle the differing row lengths as intended
  const table = WebImporter.DOMUtils.createTable(rows, document);

  element.replaceWith(table);
}
