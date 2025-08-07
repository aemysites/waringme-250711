/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row: single cell array
  const headerRow = ['Columns (columns63)'];

  // Get all feature blocks in order
  const featureBlocks = Array.from(element.querySelectorAll('[data-test-id^="feature-"]'));

  // For each feature, extract the innermost box with content
  const columns = featureBlocks.map(feature => {
    // Find the innermost .box__Box-sc-1i8zs0c-0 inside this feature
    const innerBoxes = feature.querySelectorAll('.box__Box-sc-1i8zs0c-0');
    let contentBox = innerBoxes[innerBoxes.length - 1] || feature;
    return contentBox;
  });

  // Table rows: header (one cell), then content row (one cell per column)
  const rows = [headerRow, columns];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
