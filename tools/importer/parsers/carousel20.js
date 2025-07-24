/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as in example
  const headerRow = ['Carousel (carousel20)'];

  // Find the slide content: look for slide image and text
  // Structure: .utility-position-sticky > .ix-card-rotate-2 > .card > .card-body
  let slideImage = null;
  let slideTextCellContent = null;

  // Defensive: only proceed if .card-body exists
  const cardBody = element.querySelector('.card-body');
  if (cardBody) {
    // The only image in the card body is the slide image
    slideImage = cardBody.querySelector('img');

    // The "heading" in card body is the slide heading (if present)
    const heading = cardBody.querySelector('.h4-heading');

    // If there is heading, use it as the text cell, otherwise cell is empty
    slideTextCellContent = heading ? heading : '';
  } else {
    // If no card body, leave both cells empty
    slideImage = '';
    slideTextCellContent = '';
  }

  // Compose the block table
  const cells = [
    headerRow,
    [slideImage, slideTextCellContent]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
