/* global WebImporter */
export default function parse(element, { document }) {
  // Only create the block for the columns table, since the example does not include Section Metadata.
  // Table header matches example exactly
  const headerRow = ['Columns (columns26)'];
  // Get all immediate li children as columns
  const columns = Array.from(element.children);
  // Extract content block for each column
  const columnCells = columns.map((li) => {
    // Reference the entire inner div inside the li as the cell
    // (contains logo, stars, etc)
    const flexDiv = li.querySelector('div.flex__Flex-sc-1r1ee79-0');
    // Defensive: if not found, use the li itself
    return flexDiv || li;
  });
  // Compose the table: first row is header, second row is columns
  const cells = [headerRow, columnCells];
  // Create table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the block table
  element.replaceWith(blockTable);
}