/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block table
  const headerRow = ['Hero (hero22)'];

  // Find the image for the hero background (may be optional)
  const img = element.querySelector('img');
  // For robustness, if there is more than one image, only the first is used as block background

  // Row 2: background image (optional)
  const bgImgRow = [img ? img : ''];

  // Row 3: Title, Subheading, CTA (in sequence)
  // This block can have
  // - Title (h1)
  // - Subheading (div[data-test-id=error-subheading], usually wraps a <span>)
  // - CTA (a[data-test-id=ineligible-button])

  // Find the heading
  const heading = element.querySelector('[data-test-id="error-heading"]');
  // Find the subheading
  const subheadingDiv = element.querySelector('[data-test-id="error-subheading"]');
  // Find the CTA button
  const cta = element.querySelector('[data-test-id="ineligible-button"]');

  // Compose content for the 3rd row, preserving order and reference
  const contentParts = [];
  if (heading) contentParts.push(heading);
  if (subheadingDiv) contentParts.push(subheadingDiv);
  if (cta) contentParts.push(cta);
  
  // If nothing found, ensure empty string so table row exists
  const contentRow = [contentParts.length ? contentParts : ''];

  // Compose the table
  const cells = [
    headerRow,
    bgImgRow,
    contentRow
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(block);
}
