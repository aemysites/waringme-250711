/* global WebImporter */
export default function parse(element, { document }) {
  // Header row with block name (must match example exactly)
  const headerRow = ['Hero (hero54)'];

  // Second row: Background image (none in this HTML, so leave blank string)
  const bgImageRow = [''];

  // Third row: Block content (Heading, subheading/description, CTA)
  // Find heading - prefer h1, fallback to any heading element
  let heading = element.querySelector('h1, h2, h3, h4, h5, h6');

  // Find paragraph/description (the "subheading"), usually after heading
  let subheading = null;
  // Get all possible text containers after heading
  // Look for the first 'div[data-skyui-core="Text@11.8.0"]' that isn't the heading's container
  const textDivs = element.querySelectorAll('div[data-skyui-core="Text@11.8.0"]');
  for (const div of textDivs) {
    // Exclude if this is inside a heading
    if (!div.closest('h1, h2, h3, h4, h5, h6')) {
      subheading = div;
      break;
    }
  }

  // Find the CTA link/button
  const cta = element.querySelector('a[data-test-id="stream-hero-cta"]');

  // Build content cell, referencing the actual elements
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  if (cta) contentCell.push(cta);

  const contentRow = [contentCell];

  // Compose table structure
  const tableCells = [headerRow, bgImageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
