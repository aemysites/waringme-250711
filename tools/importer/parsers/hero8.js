/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must match example exactly
  const headerRow = ['Hero (hero8)'];

  // Background image row: not present in this HTML, so empty string
  const bgImageRow = [''];

  // Content row: Gather heading and CTA (if present)
  const contentElements = [];

  // Heading: find first h2 in element (could be nested)
  const heading = element.querySelector('h2');
  if (heading) {
    contentElements.push(heading);
  }

  // No subheading present in this HTML

  // CTA: find button[data-test-id="highlight-modal-cta"]
  const ctaBtn = element.querySelector('button[data-test-id="highlight-modal-cta"]');
  if (ctaBtn) {
    // Wrap in a span (so we can include the SVG, preserving original content and semantics)
    // Buttons don't have href, so keep as button unless we find an actual link
    contentElements.push(document.createElement('br'));
    contentElements.push(ctaBtn);
  }

  // If no content elements, insert an empty string
  const contentRow = [contentElements.length ? contentElements : ['']];

  // Compose the table as in the example: 1 col x 3 rows
  const cells = [headerRow, bgImageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
