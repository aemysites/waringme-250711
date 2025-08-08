/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row exactly as required
  const headerRow = ['Hero (hero42)'];

  // Second row: Background image (none in provided HTML)
  const backgroundRow = [''];

  // Third row: main content (Headline, subheading, etc)
  // We'll collect all direct children, retaining structure
  const contentElements = Array.from(element.children);
  const contentDiv = document.createElement('div');
  contentElements.forEach((el) => contentDiv.append(el));

  // Compose the table rows
  const rows = [headerRow, backgroundRow, [contentDiv]];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(block);
}
