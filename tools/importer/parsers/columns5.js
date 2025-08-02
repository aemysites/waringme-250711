/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image block (left column)
  const leftCol = element.querySelector('[data-test-id="upsell-main-image"]');
  // Find the right content block (right column)
  // This is the flex container next to the image
  let rightCol = null;
  const flexChildren = Array.from(element.querySelectorAll(':scope > div'));
  if (flexChildren.length === 2) {
    // The second child is the content
    rightCol = flexChildren[1];
  } else {
    // fallback: try to find by class
    rightCol = element.querySelector('.sc-fhrDCu, [data-test-id="flex-container"]:not([data-test-id="upsell-main-image"])');
  }

  // Defensive: if any are missing, just use empty divs
  const leftCell = leftCol || document.createElement('div');
  const rightCell = rightCol || document.createElement('div');

  // Table header as in requirements
  const cells = [
    ['Columns (columns5)'],
    [leftCell, rightCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
