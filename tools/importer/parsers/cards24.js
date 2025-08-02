/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards24) block
  const headerRow = ['Cards (cards24)'];
  const rows = [headerRow];

  // Find list items that correspond to cards
  const ul = element.querySelector('ul');
  if (ul) {
    const lis = ul.querySelectorAll(':scope > li');
    lis.forEach(li => {
      // Get card image (first img descendant of the card)
      const cardDiv = li.querySelector(':scope > div');
      if (!cardDiv) return;
      const img = cardDiv.querySelector('img');
      // Get card title (span inside card)
      const titleSpan = cardDiv.querySelector('span');

      // Prepare title element as <strong> (heading style)
      let titleEl = '';
      if (titleSpan) {
        // Use the original span for best preservation, but ensure semantic meaning
        // Replace with <strong> if you want bold only, but semantically it's a heading
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        titleEl = strong;
      }
      rows.push([
        img,
        titleEl ? [titleEl] : ''
      ]);
    });
  }
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
