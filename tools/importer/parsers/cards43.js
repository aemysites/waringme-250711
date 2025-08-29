/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name exactly as specified
  const headerRow = ['Cards (cards43)'];
  // Find all card containers (each direct child div)
  const cardDivs = Array.from(element.querySelectorAll(':scope > div'));
  const rows = [headerRow];
  cardDivs.forEach((cardDiv) => {
    // Image: first <img> inside cardDiv
    const img = cardDiv.querySelector('img');
    // Text content (title, description, CTA) is inside div.keZUXi
    const contentWrap = cardDiv.querySelector('.keZUXi');
    let cellContents = [];
    if (contentWrap) {
      // Title + description usually inside the first <div> in contentWrap
      const box = contentWrap.querySelector('div');
      if (box) {
        // Collect all <p> elements (title and description)
        box.querySelectorAll('p').forEach((p) => cellContents.push(p));
      }
      // CTA: first <a> in contentWrap
      const cta = contentWrap.querySelector('a');
      if (cta) cellContents.push(cta);
    }
    // Only add the row if there is an image and some content
    if (img && cellContents.length > 0) {
      rows.push([img, cellContents]);
    }
  });
  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
