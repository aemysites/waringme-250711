/* global WebImporter */
export default function parse(element, { document }) {
  // Define the table header exactly
  const headerRow = ['Hero (hero21)'];

  // Find the background image (decorative asset)
  // Only one <img> in the block, use existing element reference
  const img = element.querySelector('img');
  const imageRow = [img ? img : ''];

  // Collect content elements for content row
  const contentEls = [];

  // Heading (h1)
  const heading = element.querySelector('h1');
  if (heading) contentEls.push(heading);

  // Subheading (div[data-test-id=error-subheading], contains span)
  const subheading = element.querySelector('div[data-test-id="error-subheading"]');
  if (subheading) contentEls.push(subheading);

  // Call-to-action button (a[data-test-id=ineligible-button])
  const cta = element.querySelector('a[data-test-id="ineligible-button"]');
  if (cta) contentEls.push(cta);

  // Content row: array of referenced elements, only if present
  const contentRow = [contentEls.length > 0 ? contentEls : ''];

  // Table structure: header, image, content
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with the block
  element.replaceWith(block);
}
