/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per specification
  const headerRow = ['Cards (cards25)'];

  // Find the card list container (ul)
  const cardsUl = element.querySelector('ul');
  if (!cardsUl) return;

  // For each card, extract image and text content semantically
  const rows = Array.from(cardsUl.children).map((li) => {
    const a = li.querySelector('a');
    if (!a) return null;

    // --- IMAGE CELL ---
    // Find first img inside the card for the card's main image
    let mainImg = a.querySelector('img');
    let imageCell = '';
    if (mainImg) {
      imageCell = mainImg;
    }

    // --- TEXT CELL ---
    // Gather all direct h3 and p inside the card for title and description
    const cardTextContainer = document.createElement('div');
    // Find all h3 and p inside `a`
    a.querySelectorAll('h3, p').forEach(node => {
      cardTextContainer.appendChild(node);
    });
    // Defensive: If no h3/p, fallback to other text block
    if (!cardTextContainer.childNodes.length) {
      // Try to find any div with text content
      a.querySelectorAll('div').forEach(div => {
        if (div.textContent.trim()) cardTextContainer.appendChild(div);
      });
    }

    // Use the container if it has content
    const textCell = cardTextContainer.childNodes.length ? cardTextContainer : '';

    return [imageCell, textCell];
  }).filter(Boolean);

  // Compose table and replace
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
