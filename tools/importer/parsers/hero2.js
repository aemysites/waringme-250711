/* global WebImporter */
export default function parse(element, { document }) {
  // Build table for Hero (hero2) block
  // Header row exactly matches the example
  const headerRow = ['Hero (hero2)'];

  // There is no background image in the provided HTML, so empty string for background row
  const backgroundRow = [''];

  // The content row: extract the CTA link (a), removing any SVG (icon) inside it
  let cta = element.querySelector('a');
  if (cta) {
    // Remove any SVG icons (if present)
    const svg = cta.querySelector('svg');
    if (svg) svg.remove();
  }
  // If no CTA is found, cell should be empty string
  const contentRow = [cta ? cta : ''];

  // Compose the table rows as per block structure (1 col, 3 rows)
  const cells = [
    headerRow,
    backgroundRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
