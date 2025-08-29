/* global WebImporter */
export default function parse(element, { document }) {
  // Only create the block table, no Section Metadata block required.

  // Find the first ul containing the column items
  const ul = element.querySelector('ul');
  if (!ul) return;

  // Get all li (columns), if none exist then gracefully do nothing
  const liNodes = Array.from(ul.children || []);
  if (liNodes.length === 0) return;

  // For each li, extract the main content block (the outer box)
  // Reference directly the div[data-test-id^="rtbs-single-"] inside each li
  const columns = liNodes.map(li => {
    // Each li > div[data-test-id^="rtbs-single-"] contains all column content
    const contentBox = li.querySelector('div[data-test-id^="rtbs-single-"]');
    // If contentBox doesn't exist, fallback to li itself
    return contentBox || li;
  });

  // Table structure: header row, then 1 row with all columns as cells
  const headerRow = ['Columns (columns5)']; // Header matches example
  const columnsRow = columns; // Each cell is the content reference

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
