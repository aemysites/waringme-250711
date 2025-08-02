/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: must match exactly as 'Hero (hero26)'
  const headerRow = ['Hero (hero26)'];

  // 2. Background image row: no image in this HTML, so leave empty string
  const imageRow = [''];

  // 3. Content row: Title+subheading+paragraph in a single cell
  // Find the title (h2, styled as a heading)
  let title = null;
  let subheading = null;
  let paragraph = null;

  // Title: look for h2 directly under the first Flex
  const h2 = element.querySelector('h2');
  if (h2) title = h2;

  // Paragraph/subheading: look for the deepest .text__TextElement-sc-qf7y4e-0 that is not the h2
  const textBlocks = Array.from(element.querySelectorAll('.text__TextElement-sc-qf7y4e-0'));
  // Filter out the h2 (title)
  let paraBlock = null;
  for (const block of textBlocks) {
    if (!block.closest('h2')) {
      paraBlock = block;
      break; // take the first one
    }
  }
  if (paraBlock) paragraph = paraBlock;

  // Compose content row: only include non-falsy values
  const contentCell = [];
  if (title) contentCell.push(title);
  if (paragraph) contentCell.push(paragraph);

  // If no content, put an empty string to avoid breaking the table
  if (contentCell.length === 0) contentCell.push('');

  // Compose the table rows
  const cells = [
    headerRow,
    imageRow,
    [contentCell]
  ];

  // Create the block table using the provided helper
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(block);
}
