/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match the example exactly
  const headerRow = ['Cards (cards32)'];
  const cells = [headerRow];

  // Find the <ul> (cards container)
  const ul = element.querySelector('ul');
  if (!ul) return;
  const lis = Array.from(ul.children).filter(li => li.tagName === 'LI');

  lis.forEach((li) => {
    const cardLink = li.querySelector('a');
    if (!cardLink) return;

    // Find image (first .sc-kiTBBF img inside the card)
    let img = null;
    const imgContainer = cardLink.querySelector('.sc-kiTBBF');
    if (imgContainer) {
      img = imgContainer.querySelector('img');
    }

    // Find text content (title and description)
    let textContentArr = [];
    const contentBox = cardLink.querySelector('.box__Box-sc-1i8zs0c-0.cahull');
    if (contentBox) {
      // Title (h3)
      const title = contentBox.querySelector('h3');
      if (title) textContentArr.push(title);
      // Description (p), included even if empty for structure
      const desc = contentBox.querySelector('p');
      if (desc) textContentArr.push(desc);
    }

    // Add the card row, text cell must include *both* the heading and description as an array
    cells.push([
      img ? img : '',
      textContentArr.length ? textContentArr : ''
    ]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
