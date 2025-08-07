/* global WebImporter */
export default function parse(element, { document }) {
  // The table rows: first row is header
  const rows = [['Cards (cards15)']];

  // Each card is a div[data-test-id="packages-cards"] at the top level
  const cardContainers = element.querySelectorAll(':scope > div[data-test-id="packages-cards"]');

  cardContainers.forEach((cardContainer) => {
    // Each card's main content is under its :scope > div
    const card = cardContainer.querySelector(':scope > div');
    if (!card) return;

    // --- IMAGE CELL ---
    let imageCell = null;
    const ul = card.querySelector('ul[data-test-id="packages-cards-thumbnails"]');
    if (ul) {
      const imgs = ul.querySelectorAll('img');
      if (imgs.length === 1) {
        imageCell = imgs[0];
      } else if (imgs.length > 1) {
        imageCell = Array.from(imgs);
      }
    }

    // --- TEXT CELL ---
    // We'll use an array so multiple elements can go in one cell
    const textCell = [];

    // Title (bold)
    const title = card.querySelector('p.text__TextElement-sc-qf7y4e-0.csdvmT');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      textCell.push(strong);
    }

    // Description
    const desc = card.querySelector('p.text__TextElement-sc-qf7y4e-0.kayiBF');
    if (desc) {
      if (textCell.length) textCell.push(document.createElement('br'));
      textCell.push(desc);
    }

    // Price (/month)
    const priceSpan = card.querySelector('span.text__TextElement-sc-qf7y4e-0.kgnNWM');
    if (priceSpan) {
      if (textCell.length) textCell.push(document.createElement('br'));
      // Replicate the whole price span including /month as it displays
      textCell.push(priceSpan);
    }

    // CTA link/button
    const cta = card.querySelector('a[data-test-id="packages-cards-cta"]');
    if (cta) {
      if (textCell.length) textCell.push(document.createElement('br'));
      textCell.push(cta);
    }

    // Legal text, e.g. contract details
    const legal = card.querySelector('span.text__TextElement-sc-qf7y4e-0.ijnmSx');
    if (legal) {
      if (textCell.length) textCell.push(document.createElement('br'));
      textCell.push(legal);
    }

    rows.push([
      imageCell,
      textCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
