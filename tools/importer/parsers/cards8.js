/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all direct card containers
  const headerRow = ['Cards (cards8)'];
  const cards = [];
  // Each card is a div[data-test-id="packages-cards"]
  const cardContainers = element.querySelectorAll(':scope > div[data-test-id="packages-cards"]');
  cardContainers.forEach(cardContainer => {
    // Get all card images in this card
    const imgs = Array.from(cardContainer.querySelectorAll('ul[data-test-id="packages-cards-thumbnails"] img'));
    let imageCell = '';
    if (imgs.length === 1) {
      imageCell = imgs[0];
    } else if (imgs.length > 1) {
      imageCell = imgs;
    }
    // Text content cell
    const cellContent = [];
    // Usually two <p>s: title and description
    const ps = cardContainer.querySelectorAll('p');
    ps.forEach(p => cellContent.push(p));
    // Price info
    const priceSpan = cardContainer.querySelector('.text__TextElement-sc-qf7y4e-0.kgnNWM');
    if (priceSpan) {
      cellContent.push(priceSpan);
    }
    // CTA button (if present)
    const cta = cardContainer.querySelector('a[data-test-id="packages-cards-cta"]');
    if (cta) {
      cellContent.push(cta);
    }
    // Contract/note (if present)
    const note = cardContainer.querySelector('span.text__TextElement-sc-qf7y4e-0.ijnmSx');
    if (note) {
      cellContent.push(note);
    }
    cards.push([
      imageCell,
      cellContent
    ]);
  });
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...cards
  ], document);
  element.replaceWith(table);
}
