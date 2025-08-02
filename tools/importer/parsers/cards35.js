/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Cards (cards35)'];
  const cells = [headerRow];

  // 2. Find all card list items
  const list = element.querySelector('ul');
  if (list) {
    const items = list.querySelectorAll(':scope > li');
    items.forEach((li) => {
      // Each li > div.card__Card-sc-19l2935-0
      const cardDiv = li.querySelector(':scope > div');
      if (!cardDiv) return;

      // Find the image (first img)
      const img = cardDiv.querySelector('img') || '';

      // Find the text (the span)
      const titleSpan = cardDiv.querySelector('span');
      let textCell;
      if (titleSpan) {
        // Use a <strong> for the title, as markdown example uses bold for title
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        textCell = strong;
      } else {
        textCell = '';
      }
      cells.push([img, textCell]);
    });
  }

  // 3. Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
