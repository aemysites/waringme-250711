/* global WebImporter */
export default function parse(element, { document }) {
  // Header as required by the block
  const headerRow = ['Cards (cards9)'];
  const rows = [headerRow];

  // Select all immediate card containers
  const cards = element.querySelectorAll('[data-test-id^="feature-tiles-card-"]');

  cards.forEach(card => {
    // Find image (should always be present)
    const img = card.querySelector('img');

    // Find the card text content (title and description)
    // Title: the first <p> with .hWSdcP (always present)
    const title = card.querySelector('p.hWSdcP');
    // Description: inside intersection animator, first <p> (may or may not be present)
    let description = null;
    const descContainer = card.querySelector('[data-test-id="intersection animator"]');
    if (descContainer) {
      description = descContainer.querySelector('p');
    }

    // Compose the text cell
    const textCell = [];
    if (title) textCell.push(title);
    if (description) textCell.push(description);
    
    // Add row: [image, text cell]
    rows.push([
      img,
      textCell
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
