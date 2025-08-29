/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Hero (hero40)'];

  // Row 2: Background image (optional)
  // Not present in HTML, but logo image exists
  const logoImg = element.querySelector('.hero-logo-channel-wrapper img');
  const backgroundRow = [logoImg ? logoImg : ''];

  // Row 3: Content (title, subheading, CTA, etc.)
  // In this HTML, the only possible content is in hero-details (sometimes headings/cta are here)
  // We'll extract all direct children of .hero-details (if any)
  let contentCell = '';
  const detailsWrapper = element.querySelector('.hero-details');
  if (detailsWrapper) {
    // Gather all non-empty direct children
    const children = Array.from(detailsWrapper.children).filter(
      (child) => child.textContent.trim() || child.querySelector('*')
    );
    if (children.length > 0) {
      contentCell = children;
    }
  }
  // If no content found, leave empty
  const contentRow = [contentCell];

  const cells = [headerRow, backgroundRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
