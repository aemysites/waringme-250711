/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const headerRow = ['Cards (cards28)'];
  const rows = [];

  // Find the UL containing the cards
  const ul = element.querySelector('ul');
  if (ul) {
    ul.querySelectorAll(':scope > li').forEach(cardEl => {
      // Image: first <img> inside the card
      const img = cardEl.querySelector('img');
      // Text: find the box containing the <p> elements (title, description)
      const textBox = cardEl.querySelector('.box__Box-sc-1i8zs0c-0');
      const textCell = [];
      if (textBox) {
        // Get all direct <p> children (not descendants!)
        textBox.querySelectorAll(':scope > p').forEach(p => textCell.push(p));
      }
      // Guarantee structure: first cell is image (if present), second is text content (array of elements)
      rows.push([img, textCell]);
    });
  }

  // Compose table array: header first, then one row per card
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
