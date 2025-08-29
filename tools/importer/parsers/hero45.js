/* global WebImporter */
export default function parse(element, { document }) {
  // Block table header: matches example exactly
  const headerRow = ['Hero (hero45)'];

  // Background image: this HTML does NOT contain an image, so cell must be blank
  const bgImageRow = [''];

  // The content row: should contain heading/subheading/cta/etc
  // For this HTML, find all heading elements and paragraphs, if present
  const contentElements = [];

  // Find all direct descendants that might be content elements
  // This covers headings, paragraphs, etc, within the block
  // But in this supplied HTML, the heading is nested and there is only one h2
  const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    contentElements.push(heading);
  }

  // No paragraphs or CTA found in this block, so only heading is added
  // If there were more, they would be added as well

  // Compose the table cell
  const cells = [
    headerRow,
    bgImageRow,
    [contentElements]
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
