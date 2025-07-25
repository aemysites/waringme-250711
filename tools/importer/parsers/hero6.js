/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as shown in example
  const headerRow = ['Hero (hero6)'];

  // 2nd row: Background image (img.cover-image.utility-position-absolute)
  let bgImg = null;
  // Look for any img with both classes among immediate children or their descendants
  const bgCandidates = element.querySelectorAll('img.cover-image.utility-position-absolute');
  if (bgCandidates.length > 0) bgImg = bgCandidates[0];
  const bgRow = [bgImg];

  // 3rd row: Content block (headline, subheading, CTA)
  // Seek the main info/cta card
  let contentCell = null;
  // We need to include all of the card's content, including images, heading, features, and CTA
  // Find the main card-content (usually .card-body)
  const cardBody = element.querySelector('.card-body');
  if (cardBody) {
    // Reference the entire card body content
    contentCell = [cardBody];
  } else {
    // fallback: try the largest container with class 'container'
    const container = element.querySelector('.container');
    if (container) {
      contentCell = [container];
    } else {
      // fallback: just pass the full element if nothing found
      contentCell = [element];
    }
  }
  const contentRow = [contentCell];

  // Compose the block table
  const cells = [headerRow, bgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
