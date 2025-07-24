/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: block name (must match example exactly)
  const headerRow = ['Cards'];
  const rows = [headerRow];

  // Each immediate child div is a card
  const cardDivs = element.querySelectorAll(':scope > div');
  cardDivs.forEach((cardDiv) => {
    // Find the <p> element inside this card
    const p = cardDiv.querySelector('p');
    if (p) {
      // Reference the existing <p> (do not clone or alter)
      rows.push([p]);
    }
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
