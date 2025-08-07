/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Hero (hero9)'];

  // Row 2: Background image, none in provided HTML, so cell is empty
  const bgImageRow = [''];

  // Row 3: Title (as heading), CTA button (as link), both as present
  let contentRowCell = [];
  // Locate the content: the flex row with the title and the CTA
  const flexRow = element.querySelector('.flex__Flex-sc-1r1ee79-0');
  if (flexRow) {
    // Title: first child span
    const span = flexRow.querySelector('span');
    if (span) {
      // Use h1 as the heading for semantic meaning
      const h1 = document.createElement('h1');
      h1.textContent = span.textContent;
      contentRowCell.push(h1);
    }
    // CTA: link (usually a button)
    const link = flexRow.querySelector('a');
    if (link) {
      contentRowCell.push(link); // Use the existing element, preserve reference
    }
  }
  // If nothing found, use empty string
  if (contentRowCell.length === 0) {
    contentRowCell = [''];
  }

  const cells = [
    headerRow,
    bgImageRow,
    [contentRowCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
