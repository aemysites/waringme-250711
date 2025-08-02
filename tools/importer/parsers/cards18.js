/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row for the block
  const headerRow = ['Cards (cards18)'];
  const cells = [headerRow];

  // Helper: Compose text cell for cards
  function composeTextCell(titleElem, descElem) {
    const textElem = document.createElement('div');
    if (titleElem) {
      // Make title bold (as per example, normally heading; here keep span, but bold)
      const title = document.createElement('strong');
      title.append(...Array.from(titleElem.childNodes));
      textElem.appendChild(title);
    }
    if (descElem) {
      if (textElem.childNodes.length > 0) textElem.appendChild(document.createElement('br'));
      textElem.append(...Array.from(descElem.childNodes));
    }
    return textElem;
  }

  // Find the main (large) card, the first <a> at the top
  const mainCardLink = element.querySelector(':scope > a');
  if (mainCardLink) {
    // Find the image (1st img in main card)
    const mainImg = mainCardLink.querySelector('img');
    // Find title and desc (the two spans in the content area)
    const mainTextBox = mainCardLink.querySelector('div.flex__Flex-sc-1r1ee79-0.dWHTZf');
    let mainTitle = null, mainDesc = null;
    if (mainTextBox) {
      const spans = mainTextBox.querySelectorAll('span');
      if (spans.length > 0) mainTitle = spans[0];
      if (spans.length > 1) mainDesc = spans[1];
    }
    if (mainImg && (mainTitle || mainDesc)) {
      const textCell = composeTextCell(mainTitle, mainDesc);
      cells.push([mainImg, textCell]);
    }
  }

  // Now process the smaller cards in the side-list
  const sideCardsWrapper = element.querySelector('div.flex__Flex-sc-1r1ee79-0.ejowPs');
  if (sideCardsWrapper) {
    const cardLinks = sideCardsWrapper.querySelectorAll(':scope > a');
    cardLinks.forEach(cardLink => {
      // In each card, get the image and the title (in a span)
      const grid = cardLink.querySelector('div.grid__Grid-sc-ysk8de-0');
      if (!grid) return; // skip if structure doesn't match
      const img = grid.querySelector('img');
      const span = grid.querySelector('span');
      // For these cards, only a title, no desc
      if (img && span) {
        // Make title bold for consistency
        const textCell = composeTextCell(span, null);
        cells.push([img, textCell]);
      }
    });
  }

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
