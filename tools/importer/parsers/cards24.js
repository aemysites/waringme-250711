/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as per block requirements
  const rows = [['Cards (cards24)']];

  // Select all card links (each card is an <a> element)
  const cards = element.querySelectorAll(':scope > a.utility-link-content-block');

  cards.forEach(card => {
    // ----- First cell: Image element -----
    // Find the first <img> inside the card
    let imageEl = null;
    const imageContainer = card.querySelector('div.utility-aspect-2x3');
    if (imageContainer) {
      imageEl = imageContainer.querySelector('img');
    }

    // ----- Second cell: Textual content -----
    // We want: tag(s) + date, heading/title
    const textCellContent = [];

    // Tag + date row
    const tagRow = card.querySelector('div.flex-horizontal');
    if (tagRow) {
      textCellContent.push(tagRow);
    }

    // Heading/title
    const heading = card.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      textCellContent.push(heading);
    }

    rows.push([
      imageEl || '',
      textCellContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
