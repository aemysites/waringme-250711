/* global WebImporter */
export default function parse(element, { document }) {
  // Header row per block name
  const headerRow = ['Cards (cards32)'];
  const cells = [headerRow];

  // The direct list of cards is a <ul> with <li> children
  const ul = element.querySelector('ul');
  if (!ul) return;
  const lis = Array.from(ul.children).filter(c => c.tagName === 'LI');

  lis.forEach(li => {
    // The clickable card is the <a>
    const a = li.querySelector('a');
    if (!a) return;
    // Card image: always an <img> somewhere inside
    const img = a.querySelector('img');
    // Card text content: heading and description
    const h3 = a.querySelector('h3');
    const p = a.querySelector('p');
    // Assemble text cell: always include h3, only include p if it has content
    const textCell = [];
    if (h3) textCell.push(h3);
    if (p && p.textContent.trim()) textCell.push(p);
    // Typical cards32 don't have CTA, so omit unless present
    // Build the table row
    cells.push([
      img || '',
      textCell.length ? textCell : ''
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
