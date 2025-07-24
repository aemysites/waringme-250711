/* global WebImporter */
export default function parse(element, { document }) {
  // Table header, must match exactly
  const headerRow = ['Hero (hero19)'];

  // Find the background images block
  // This is the .ix-hero-scale-3x-to-1x .grid-layout with imgs
  let backgroundCell = '';
  const gridWrapper = element.querySelector('.ix-hero-scale-3x-to-1x');
  if (gridWrapper) {
    const gridLayout = gridWrapper.querySelector('.grid-layout');
    if (gridLayout) {
      // Use all <img> elements as the background collage
      const imgs = Array.from(gridLayout.querySelectorAll('img'));
      // Only add if there is at least one image
      if (imgs.length > 0) {
        backgroundCell = imgs;
      }
    }
  }

  // Find the text and CTAs
  // .ix-hero-scale-3x-to-1x-content .container
  let contentCell = '';
  const textContent = element.querySelector('.ix-hero-scale-3x-to-1x-content .container');
  if (textContent) {
    contentCell = textContent;
  }

  // Create the table structure: 1 column, 3 rows
  const rows = [
    headerRow,
    [backgroundCell],
    [contentCell],
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
