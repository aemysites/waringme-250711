/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must be a single cell, matching the spec
  const headerRow = ['Columns (columns43)'];

  // Find the ul that contains the columns
  const ul = element.querySelector('ul');
  if (!ul) return;
  const lis = Array.from(ul.querySelectorAll(':scope > li'));

  // Each li represents a column. We grab the content for each column (feature)
  const columns = lis.map((li) => {
    // Find the content representing the column feature
    const box = li.querySelector('[data-test-id^="rtbs-single-"]');
    if (!box) return '';
    const grid = box.querySelector('[data-skyui-core^="Grid"]');
    return grid || box;
  });

  if (columns.length === 0) return;

  // The structure: first row is header (one cell), second row is the columns (one cell per column)
  const tableRows = [headerRow, columns];

  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
