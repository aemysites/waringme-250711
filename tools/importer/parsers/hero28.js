/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row must match exactly
  const headerRow = ['Hero (hero28)'];

  // 2. Image row (background image) -- not present in this example, so empty string
  const imageRow = [''];

  // 3. Content row: Heading and sub-content
  // Heading (h2), then the paragraph/description

  const contentElements = [];
  // Find the main heading (h2)
  const h2 = element.querySelector('h2');
  if (h2) contentElements.push(h2);
  // Find the descriptive paragraph/span that is not inside the h2
  // Get all direct descendants (not the header) that have text content
  const spans = Array.from(element.querySelectorAll('span'));
  spans.forEach((span) => {
    // Add span if not a descendant of h2 and has text
    if ((!h2 || !h2.contains(span)) && span.textContent.trim() !== '') {
      contentElements.push(span);
    }
  });
  // If nothing but h2 was found, try for any text-rich div
  if (contentElements.length === 1) {
    const richDiv = Array.from(element.querySelectorAll('div')).find(div => div.textContent.trim() && (!h2 || !div.contains(h2)));
    if (richDiv && !contentElements.includes(richDiv)) {
      contentElements.push(richDiv);
    }
  }

  // Final content row with all content
  const contentRow = [contentElements];

  // Build table
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the table
  element.replaceWith(table);
}
