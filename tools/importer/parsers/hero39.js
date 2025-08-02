/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required by spec
  const headerRow = ['Hero (hero39)'];

  // Second row: Background image cell (none in provided HTML)
  const bgRow = [''];

  // Third row: Main content (heading + subheading/paragraph)
  // Find heading
  const heading = element.querySelector('h2');
  // Find paragraph/description text
  let description = null;
  // Look for a text container with a span inside (as in provided HTML)
  const descContainer = element.querySelector('[data-skyui-core="Text@11.8.0"].jVKIid');
  if (descContainer) {
    description = descContainer;
  }

  // Build the content cell
  // Preserve existing elements and line breaks if both heading and description present
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) {
    // Add a <br> if both heading and description are present
    if (heading) contentCell.push(document.createElement('br'));
    contentCell.push(description);
  }

  // Compose the rows as per spec: header, bg image, content
  const rows = [
    headerRow,
    bgRow,
    [contentCell]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
