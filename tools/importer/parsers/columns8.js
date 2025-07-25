/* global WebImporter */
export default function parse(element, { document }) {
  // Header must be a single-cell row (one column) per spec
  const headerRow = ['Columns (columns8)'];

  // Collect all direct children for the columns row
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Build the rows for createTable: headerRow, then columns as one row
  const tableRows = [
    headerRow, // one column (merged when rendered)
    columns    // N columns (one per content cell)
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
