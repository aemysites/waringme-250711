/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified
  const headerRow = ['Cards (cards49)'];
  const rows = [headerRow];

  // Get all immediate child card divs (each card is a top-level child)
  const cardDivs = Array.from(element.querySelectorAll(':scope > div'));

  cardDivs.forEach(card => {
    // Image: first direct child img
    const img = card.querySelector('img');

    // Find text container: usually the first direct child div after the img
    let textContainer = null;
    const directChildren = Array.from(card.children);
    for (let i = 0; i < directChildren.length; i++) {
      if (directChildren[i].tagName === 'IMG') {
        // Usually, the *next* child div is the text container
        if (directChildren[i+1] && directChildren[i+1].tagName === 'DIV') {
          textContainer = directChildren[i+1];
        }
        break;
      }
    }
    if (!textContainer) {
      // fallback: look for the first div in the card
      textContainer = card.querySelector('div');
    }

    // Add the row only if we have at least image and text content
    if (img && textContainer) {
      rows.push([img, textContainer]);
    }
    // If missing image or textContainer, skip; don't break the block structure
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
