/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get the first .w-layout-grid.grid-layout.tablet-1-column.grid-gap-lg
  const contentGrid = element.querySelector('.w-layout-grid.grid-layout.tablet-1-column.grid-gap-lg');
  // Helper: Get the second .w-layout-grid.grid-layout.mobile-portrait-1-column.grid-gap-md
  const imagesGrid = element.querySelector('.w-layout-grid.grid-layout.mobile-portrait-1-column.grid-gap-md');
  
  // LEFT COLUMN: Combine all content cells from the first grid (headline, eyebrow, paragraph, author info, read more button)
  let leftCol;
  if (contentGrid) {
    // Create a wrapper div to keep everything together
    const leftWrapper = document.createElement('div');
    // Get all immediate children (the main two content columns)
    const topDivs = contentGrid.querySelectorAll(':scope > div');
    topDivs.forEach(div => leftWrapper.appendChild(div));
    leftCol = leftWrapper;
  } else {
    leftCol = document.createElement('div');
  }
  
  // RIGHT COLUMN: Combine all direct image divs from the images grid
  let rightCol;
  if (imagesGrid) {
    const rightWrapper = document.createElement('div');
    const imageDivs = imagesGrid.querySelectorAll(':scope > div');
    imageDivs.forEach(div => {
      if (div.querySelector('img')) {
        rightWrapper.appendChild(div);
      }
    });
    rightCol = rightWrapper;
  } else {
    rightCol = document.createElement('div');
  }

  // Compose the table with the header and two columns
  const cells = [
    ['Columns (columns16)'],
    [leftCol, rightCol],
  ];
  
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
