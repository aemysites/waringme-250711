/* global WebImporter */
export default function parse(element, { document }) {
  // Find all direct card containers
  const cardEls = Array.from(element.querySelectorAll('[data-test-id="packages-cards"]'));
  // Build rows for the cards block
  const rows = [];
  // Header row as per requirement and example
  rows.push(['Cards (cards15)']);
  // For each card, extract image(s) and text content
  cardEls.forEach(card => {
    // Images: all img under ul[data-test-id=packages-cards-thumbnails]
    const thumbsUl = card.querySelector('ul[data-test-id="packages-cards-thumbnails"]');
    let leftCell = null;
    if (thumbsUl) {
      const imgs = Array.from(thumbsUl.querySelectorAll('img'));
      if (imgs.length > 1) {
        leftCell = imgs;
      } else if (imgs.length === 1) {
        leftCell = imgs[0];
      }
    }
    // Right cell: build up text block from elements
    const rightCellItems = [];

    // Title: p.text__TextElement-sc-qf7y4e-0.csdvmT
    const title = card.querySelector('p.text__TextElement-sc-qf7y4e-0.csdvmT');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent;
      rightCellItems.push(strong);
    }
    // Description: p.text__TextElement-sc-qf7y4e-0.kayiBF
    const desc = card.querySelector('p.text__TextElement-sc-qf7y4e-0.kayiBF');
    if (desc) {
      if (rightCellItems.length > 0) rightCellItems.push(document.createElement('br'));
      rightCellItems.push(desc);
    }
    // Price: look for .kgnNWM inside the card
    const price = card.querySelector('.kgnNWM');
    if (price) {
      rightCellItems.push(document.createElement('br'));
      rightCellItems.push(price);
    }
    // CTA: a[data-test-id="packages-cards-cta"]
    const cta = card.querySelector('a[data-test-id="packages-cards-cta"]');
    if (cta) {
      rightCellItems.push(document.createElement('br'));
      rightCellItems.push(cta);
    }
    // Extra info: span.ijnmSx (contract note)
    const note = card.querySelector('.ijnmSx');
    if (note) {
      rightCellItems.push(document.createElement('br'));
      rightCellItems.push(note);
    }
    // Clean leading br if present
    while(rightCellItems[0] && rightCellItems[0].tagName === 'BR') rightCellItems.shift();
    rows.push([leftCell, rightCellItems]);
  });
  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
