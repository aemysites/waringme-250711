/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: block name from the example (must match exactly)
  const headerRow = ['Hero (hero2)'];

  // 2. Second row: Background image (optional). Not present in given HTML, use empty string.
  const backgroundRow = [''];

  // 3. Third row: Title (as heading), subheading, CTA, and logo (if present)
  // In this HTML, the logo is an <img> inside a <div> which is inside an <h1> with a <span> for the main heading.
  // We want to preserve semantic heading and logo.
  const h1 = element.querySelector('h1');
  const contentCell = [];
  if (h1) {
    // Find logo image
    const logoDiv = h1.querySelector('div');
    if (logoDiv) {
      const logoImg = logoDiv.querySelector('img');
      if (logoImg) {
        contentCell.push(logoImg);
      }
    }
    // Add heading text (span) as heading element to preserve semantics
    const headingSpan = h1.querySelector('span');
    if (headingSpan && headingSpan.textContent.trim() !== '') {
      // Create a heading element to preserve heading semantics
      const heading = document.createElement('h1');
      heading.textContent = headingSpan.textContent;
      contentCell.push(heading);
    }
  }
  // Fallback: if content cell is empty, use the element's textContent
  if (contentCell.length === 0) {
    contentCell.push(element.textContent);
  }

  // Build the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    backgroundRow,
    [contentCell],
  ], document);

  // Replace the original element with the table
  element.replaceWith(table);
}
