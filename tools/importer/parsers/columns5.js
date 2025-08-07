/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example (must match exactly)
  const headerRow = ['Columns (columns5)'];

  // Left (first) column: the main image
  let leftCell = document.createElement('div');
  const mainImgDiv = element.querySelector('[data-test-id="upsell-main-image"]');
  if (mainImgDiv) {
    leftCell = mainImgDiv;
  }

  // Right (second) column: All content that is NOT the main image div, but is in the same flex container as the image
  let rightCell = document.createElement('div');
  const flexContainer = element.querySelector('[data-test-id="flex-container"]');
  if (flexContainer) {
    // Get all children except the main image div
    const allDivs = Array.from(flexContainer.children);
    const nonImageDivs = allDivs.filter(child => child !== mainImgDiv);
    // Append all non-image content to a single container
    if (nonImageDivs.length > 0) {
      rightCell = document.createElement('div');
      nonImageDivs.forEach(div => rightCell.appendChild(div));
    }
  }

  // If nothing found, fallback to original element
  if (!mainImgDiv || rightCell.childNodes.length === 0) {
    rightCell = element;
  }

  // Compose cells for the table block
  const tableRows = [
    headerRow,
    [leftCell, rightCell]
  ];

  // Create the block and replace the original element
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
