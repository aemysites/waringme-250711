/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Cards (cards38)
  const headerRow = ['Cards (cards38)'];

  // Check for a heading above the cards (optional row above cards)
  const mainHeading = element.querySelector('h2');
  let headingRow = [];
  if (mainHeading) {
    headingRow = [[mainHeading]];
  }

  // Select all direct children that are cards (images with text and CTA)
  // Cards are the elements with data-test-id="double-image-block-image-0", etc.
  const cardEls = Array.from(element.querySelectorAll('[data-test-id^="double-image-block-image-"]'));

  // For each card, extract the image and the right text/cta cell
  const cardRows = cardEls.map(cardEl => {
    // Image element (must reference actual element)
    const img = cardEl.querySelector('img');
    // Card text wrapper (contains 2 paragraphs: heading and description)
    const textBox = cardEl.querySelector('.box__Box-sc-1i8zs0c-0');
    // Get CTA link (if any)
    const link = cardEl.querySelector('a');
    // We'll assemble cell content with references only
    const textCellContent = [];
    if (textBox) textCellContent.push(textBox);
    if (link) textCellContent.push(link);
    return [img, textCellContent];
  });

  // Build cells: header, optional heading, cards
  const cells = [headerRow].concat(headingRow, cardRows);

  // Create the table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
