/* global WebImporter */
export default function parse(element, { document }) {
  // Find all immediate direct children with data-test-id^="feature-"
  const featureDivs = Array.from(element.querySelectorAll(':scope > div[data-test-id^="feature-"]'));

  // Build columns content by referencing the deepest Flex container (with both image & text) in each feature
  const columns = featureDivs.map((feature) => {
    // Find the innermost Flex container for this feature
    // (since some features have a nested Box > Box > Flex structure)
    let flex = feature.querySelector('.flex__Flex-sc-1r1ee79-0');
    // If not found, fallback to the feature block itself
    const content = flex ? flex : feature;
    return content;
  });

  // Table header row: must be exactly as required, single cell
  const headerRow = ['Columns (columns17)'];
  // Second row: columns for each feature
  const tableRows = [headerRow, columns];
  
  // Create the table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  // Set proper colspan on header row
  if (columns.length > 1) {
    const th = table.querySelector('th');
    th.setAttribute('colspan', columns.length);
  }
  // Replace the original element with the structured table
  element.replaceWith(table);
}
