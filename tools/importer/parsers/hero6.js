/* global WebImporter */
export default function parse(element, { document }) {
  // Header row that matches the example exactly
  const headerRow = ['Hero (hero6)'];

  // No background image in the HTML, so leave background image row empty
  const bgRow = [''];

  // Content row: include all direct children that could be content (H1-H6, P, etc.)
  const contentElements = Array.from(element.children).filter(child => {
    // Accept any visible element with non-empty text, including headings and paragraphs
    return (
      /^H[1-6]$/.test(child.tagName) ||
      child.tagName === 'P' ||
      child.tagName === 'SPAN' ||
      child.textContent.trim().length > 0
    );
  });

  // If there is content, use it; otherwise, use an empty string
  const contentRow = [contentElements.length > 0 ? contentElements : ['']];

  // Assemble the table
  const cells = [headerRow, bgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
