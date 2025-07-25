/* global WebImporter */
export default function parse(element, { document }) {
  // Set up the header row as specified in the block info
  const headerRow = ['Columns (columns37)'];
  // Get all immediate children (which are columns)
  const columns = Array.from(element.children);
  // Prepare a row where each cell is the entire content of a column
  const contentRow = columns.map((col) => col);
  // Table structure: header row, then content row
  const cells = [
    headerRow,
    contentRow,
  ];
  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}