/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards38) block header
  const headerRow = ['Cards (cards38)'];
  // Find the container that holds all card items
  // This is the .dNBTcY flex container inside the section
  const cardsContainer = element.querySelector('.dNBTcY');
  if (!cardsContainer) return;
  // Each card is a direct child with [data-test-id^="double-image-block-image-"]
  const cardDivs = Array.from(cardsContainer.querySelectorAll('[data-test-id^="double-image-block-image-"]'));

  // Parse each card
  const rows = cardDivs.map(card => {
    // First cell: the image (existing img element)
    const img = card.querySelector('img');

    // Second cell: all text and CTA
    // The text box contains two <p>s (title, description)
    const textBox = card.querySelector('.bXPNVb');
    const textCellContent = [];
    if (textBox) {
      const ps = textBox.querySelectorAll('p');
      if (ps[0]) {
        // Title as strong
        const strong = document.createElement('strong');
        strong.textContent = ps[0].textContent;
        textCellContent.push(strong);
      }
      if (ps[1]) {
        textCellContent.push(document.createElement('br'));
        textCellContent.push(ps[1]);
      }
    }
    // CTA: the a.link__Link-sc-up7frj-0 ("Upgrade")
    const cta = card.querySelector('a.link__Link-sc-up7frj-0');
    if (cta) {
      textCellContent.push(document.createElement('br'));
      textCellContent.push(cta);
    }

    return [img, textCellContent];
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
