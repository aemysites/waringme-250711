/* global WebImporter */
export default function parse(element, { document }) {
  // Build the cards block table
  const cells = [
    ['Cards (cards17)'],
  ];

  // Find each card
  const ul = element.querySelector('ul');
  if (ul) {
    const lis = ul.querySelectorAll(':scope > li');
    lis.forEach((li) => {
      // First image
      const img = li.querySelector('img');
      // All text ps in the card, expected: first p is title, second p is description
      const ps = li.querySelectorAll('p');
      let textCell;
      if (ps.length === 0) {
        textCell = '';
      } else {
        // Title: bold (strong)
        const strong = document.createElement('strong');
        strong.textContent = ps[0].textContent;
        // Description: other ps (if any), separated by <br>
        const descEls = [];
        for (let i = 1; i < ps.length; i++) {
          // Insert a <br> before each new p
          descEls.push(document.createElement('br'));
          descEls.push(ps[i]);
        }
        textCell = [strong, ...descEls];
      }
      cells.push([img, textCell]);
    });
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
