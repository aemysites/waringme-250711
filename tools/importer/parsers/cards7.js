/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match example
  const headerRow = ['Cards (cards7)'];

  // Defensive: locate card items list
  const list = element.querySelector('ul');
  if (!list) return;
  const items = Array.from(list.children);

  const rows = [headerRow];

  items.forEach(li => {
    // Defensive: find card main container
    const card = li.querySelector('[data-skyui-core^="Card"]');
    if (!card) return;
    // First image inside card
    const img = card.querySelector('img');
    // Find the block with all text and action content, immediately after img
    let textCell = null;
    if (img) {
      // detailsDiv is usually the next sibling after img
      let detailsDiv = img.nextElementSibling;
      if (detailsDiv && detailsDiv.tagName === 'DIV') {
        textCell = detailsDiv;
      } else {
        // fallback: cluster all non-img children except img
        textCell = document.createElement('div');
        Array.from(card.children).forEach(child => {
          if (child !== img) textCell.appendChild(child);
        });
      }
    } else {
      // fallback: cluster all card children together
      textCell = document.createElement('div');
      Array.from(card.children).forEach(child => {
        textCell.appendChild(child);
      });
    }
    rows.push([
      img ? img : '',
      textCell
    ]);
  });

  // Create and insert table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
