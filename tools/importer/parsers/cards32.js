/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified in the example
  const headerRow = ['Cards (cards32)'];
  // Get all card anchor elements that are direct children of the grid div
  const cards = Array.from(element.querySelectorAll(':scope > a'));
  const rows = [headerRow];
  cards.forEach(card => {
    // Card image: first img in this card
    const img = card.querySelector('img');
    // The card's text is in the div that contains h3 and p (second div inside the inner grid)
    let textContainer = null;
    // Get the inner grid (first child div inside the a)
    const innerGrid = card.querySelector(':scope > div');
    if (innerGrid) {
      // textContainer is the div inside innerGrid that's NOT the image
      const innerDivs = Array.from(innerGrid.children).filter(el => el.tagName === 'DIV');
      // Normally only one div, but be robust
      textContainer = innerDivs.find(div => div.querySelector('h3, .h4-heading, p')) || innerDivs[0] || innerGrid;
    }
    // Fallback if above fails
    if (!textContainer) {
      // Find the first div inside the card after the image
      const allDivs = Array.from(card.querySelectorAll('div'));
      textContainer = allDivs.find(div => div.querySelector('h3, .h4-heading, p')) || allDivs[allDivs.length - 1];
    }
    // As a final fallback, put entire card except image
    if (!textContainer) {
      textContainer = document.createElement('div');
      Array.from(card.children).forEach(child => {
        if (child !== img) textContainer.appendChild(child);
      });
    }
    rows.push([img, textContainer]);
  });
  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the block table
  element.replaceWith(table);
}
