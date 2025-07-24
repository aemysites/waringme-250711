/* global WebImporter */
export default function parse(element, { document }) {
  // Helper function to safely get child div by index
  function getChildDivByIndex(parent, idx) {
    const divs = Array.from(parent.children).filter(el => el.tagName === 'DIV');
    return divs[idx] || null;
  }

  // 1. Table header must exactly match example
  const headerRow = ['Hero (hero13)'];

  // 2. Find the .grid-layout container
  const grid = element.querySelector('.grid-layout');

  let imageCell = '';
  let contentCell = '';

  if (grid) {
    // The first grid child with an image as background
    const firstDiv = getChildDivByIndex(grid, 0);
    if (firstDiv) {
      const img = firstDiv.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }
    // The second grid child with the content
    const secondDiv = getChildDivByIndex(grid, 1);
    if (secondDiv) {
      // Try to find the main heading/container
      // Use the deepest child that actually contains content
      let possibleContent = secondDiv.querySelector('.utility-margin-bottom-6rem') || secondDiv;
      contentCell = possibleContent;
    }
  }

  // Edge case: if image/content missing, keep blank string as cell value

  const cells = [
    headerRow,
    [imageCell],
    [contentCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
