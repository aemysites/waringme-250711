/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Gather all immediate child divs (each column)
  const columns = element.querySelectorAll(':scope > div');
  // 2. Prepare rows array for the block table
  const rows = [];
  // 3. Add header row (must be a single cell, per requirements)
  rows.push(['Columns (columns35)']);
  // 4. Add content row with a cell for each column
  const contentRow = [];
  columns.forEach((colDiv) => {
    // For each column, collect all child images and group them in an array
    // If there are no images, reference the colDiv itself for flexibility
    const imgs = Array.from(colDiv.querySelectorAll('img'));
    if (imgs.length > 0) {
      contentRow.push(imgs.length === 1 ? imgs[0] : imgs);
    } else {
      contentRow.push(colDiv);
    }
  });
  rows.push(contentRow);
  // 5. Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // 6. Replace the original element
  element.replaceWith(block);
}
