/* global WebImporter */
export default function parse(element, { document }) {
  // Find the immediate child div that contains the columns (features)
  let mainDiv = element.querySelector(':scope > div');
  if (!mainDiv) mainDiv = element;

  // Find all columns (feature blocks)
  const columnDivs = Array.from(mainDiv.querySelectorAll(':scope > div[data-test-id^="feature-"]'));

  // For each column, get the immediate flex wrapper, or fallback to the column itself
  const columns = columnDivs.map(col => {
    const flex = col.querySelector(':scope > div > [data-skyui-core^="Flex@"]');
    return flex || col;
  });

  // If no columns found, do nothing
  if (!columns.length) return;

  // Header row: exactly one cell (the block name and variant)
  const cells = [
    ['Columns (columns65)'], // single cell header row
    columns                 // as many columns as needed in second row
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
