/* global WebImporter */
export default function parse(element, { document }) {
  // Define the header row
  const headerRow = ['Columns (columns26)'];

  // Each li is a column
  const columnLis = Array.from(element.querySelectorAll(':scope > li'));

  // For each column, gather the *existing* main content div
  // This div contains both the image and the stars (and any text if present)
  const cells = columnLis.map((li) => {
    // find the main flex container in the li
    const flexDiv = li.querySelector(':scope > div');
    // Defensive: fallback to the li itself if the div is missing
    return flexDiv || li;
  });

  // Compose the table structure: header, then one row with all columns
  const tableData = [headerRow, cells];
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the table block
  element.replaceWith(block);
}
