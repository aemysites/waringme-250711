/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main grid with the two columns of hero content
  const grid = element.querySelector('.w-layout-grid.grid-layout');
  if (!grid) return;

  const gridChildren = Array.from(grid.children);

  // For this layout, usually one column is text/buttons, one is an image (or vice versa)
  // We'll keep their order, but group all non-images in one cell and all images in the other
  let leftContent = [];
  let rightContent = [];

  gridChildren.forEach((child, index) => {
    if (child.tagName.toLowerCase() === 'img') {
      rightContent.push(child);
    } else {
      leftContent.push(child);
    }
  });

  // If there is no image, keep placeholder
  if (rightContent.length === 0) {
    rightContent.push(document.createElement('div'));
  }
  // If there is no text, keep placeholder
  if (leftContent.length === 0) {
    leftContent.push(document.createElement('div'));
  }

  // Wrap left content into a container div if multiple elements
  let leftCell = leftContent.length === 1 ? leftContent[0] : (() => {
    const d = document.createElement('div');
    leftContent.forEach(el => d.appendChild(el));
    return d;
  })();

  // Wrap right content into a container div if multiple elements
  let rightCell = rightContent.length === 1 ? rightContent[0] : (() => {
    const d = document.createElement('div');
    rightContent.forEach(el => d.appendChild(el));
    return d;
  })();

  // Create the block table with the correct header
  const cells = [
    ['Columns (columns15)'],
    [leftCell, rightCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
