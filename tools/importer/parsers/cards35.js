/* global WebImporter */
export default function parse(element, { document }) {
  // Create header row matching the specification
  const headerRow = ['Cards (cards35)'];
  const cells = [headerRow];

  // Find the <ul> that contains the cards
  const ul = element.querySelector('ul');
  if (!ul) return;
  const lis = ul.querySelectorAll(':scope > li');

  lis.forEach(li => {
    // Find the image element (should exist)
    const img = li.querySelector('img');
    // Find the text element (should exist)
    const span = li.querySelector('span');
    let textCell = null;
    if (span) {
      // Create a <strong> element for the title, referencing the existing text
      const strong = document.createElement('strong');
      strong.textContent = span.textContent;
      textCell = strong;
    } else {
      // Fallback if no span exists
      textCell = '';
    }
    // Add the row for this card
    cells.push([
      img || '',
      textCell
    ]);
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
