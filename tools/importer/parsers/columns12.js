/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be EXACTLY one cell, even if multiple columns are in data rows
  const headerRow = ['Columns (columns12)'];

  // Find the flex container (which contains both left and right column elements)
  const flex = element.querySelector('.flex__Flex-sc-1r1ee79-0');
  let columns = [];
  if (flex) {
    // Each immediate child of flex is a column content
    columns = Array.from(flex.children);
  } else {
    // If flex is missing, fallback: treat the element as a single cell
    columns = [element];
  }

  // Build the table: first row is header (1 column), second row is columns content
  const tableRows = [headerRow, columns];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace original element with the new block table
  element.replaceWith(block);
}
