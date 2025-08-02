/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards28) block
  const headerRow = ['Cards (cards28)'];
  const rows = [headerRow];

  // Get all direct <li> cards
  const ul = element.querySelector('ul');
  if (ul) {
    const liCards = ul.children;
    for (const li of liCards) {
      // Each card: image in first cell, text content in second cell
      // Image
      const img = li.querySelector('img');

      // Text content: find the innermost box__Box-sc-1i8zs0c-0 (contains two <p>)
      const box = li.querySelector('div.box__Box-sc-1i8zs0c-0');

      // Robust: if box not found, fallback to all <p> within flex__Flex-sc-1r1ee79-0.keZUXi
      let textContent = box;
      if (!box) {
        const flexText = li.querySelector('div.flex__Flex-sc-1r1ee79-0.keZUXi');
        if (flexText) {
          const ps = flexText.querySelectorAll('p');
          if (ps.length) {
            const frag = document.createElement('div');
            ps.forEach(p => frag.appendChild(p));
            textContent = frag;
          }
        }
      }

      rows.push([img, textContent]);
    }
  }

  // Create and insert table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
