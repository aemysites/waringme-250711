/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Hero (hero7)'];

  // Find the two main grid columns divs (background image, and content)
  const grids = element.querySelectorAll(':scope > .w-layout-grid > div');

  // Background image (first grid cell)
  let bgImg = '';
  if (grids.length > 0) {
    const img = grids[0].querySelector('img');
    if (img) {
      bgImg = img;
    }
  }

  // Content (second grid cell)
  let contentCell = '';
  if (grids.length > 1) {
    // The card contains all text and CTA elements
    const card = grids[1].querySelector('.card');
    if (card) {
      // Collect all relevant elements in order
      const parts = [];
      // Heading: h1, h2, h3 (in priority order)
      const heading = card.querySelector('h1, h2, h3');
      if (heading) parts.push(heading);
      // Subheading: .subheading, or first <p> not inside button-group
      let subheading = card.querySelector('.subheading');
      if (!subheading) {
        // Fallback: first <p> inside card, excluding those in button-group
        const ps = Array.from(card.querySelectorAll('p'));
        subheading = ps.find(p => !p.closest('.button-group'));
      }
      if (subheading) parts.push(subheading);
      // Button group
      const btnGroup = card.querySelector('.button-group');
      if (btnGroup) parts.push(btnGroup);
      if (parts.length > 0) {
        contentCell = parts;
      }
    }
  }

  // Build block table with 1 column, 3 rows
  const rows = [
    headerRow,
    [bgImg],
    [contentCell]
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
