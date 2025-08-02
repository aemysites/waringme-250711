/* global WebImporter */
export default function parse(element, { document }) {
  // Table header, must match exactly
  const cells = [
    ['Cards (cards30)']
  ];

  // Find the cards list (ul > li)
  const ul = element.querySelector('ul');
  if (!ul) return;
  const lis = ul.querySelectorAll(':scope > li');

  lis.forEach((li) => {
    // Image: first <img> in li
    const img = li.querySelector('img');
    // Text content: all <p> inside li (title and description)
    const ps = li.querySelectorAll('p');
    const textCell = [];
    if (ps.length > 0) {
      // Title: first <p>, wrapped in <strong>, but reference the existing <p> for description
      const strong = document.createElement('strong');
      strong.textContent = ps[0].textContent;
      textCell.push(strong);
      if (ps.length > 1) {
        textCell.push(document.createElement('br'));
        textCell.push(ps[1]);
      }
    }
    cells.push([
      img,
      textCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
