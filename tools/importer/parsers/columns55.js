/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the columns from the immediate flex row
  const flexRow = element.querySelector('.flex__Flex-sc-1r1ee79-0');
  let columns = [];
  if (flexRow) {
    // Place each child of flexRow as a column
    columns = Array.from(flexRow.children);
  }
  // If no columns found, fallback to empty cells
  if (columns.length === 0) {
    columns = [document.createTextNode('')];
  }

  // Header row must be a single cell spanning all columns
  // So pass a single-cell array for the header row
  const cells = [
    ['Columns (columns55)'],
    columns
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
