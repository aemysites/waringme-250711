/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid that lays out the columns
  // In this markup, section > div.w-layout-grid.grid-layout is the main columns grid
  // It contains: [0]: inner grid with content, [1]: image
  const columnsGrid = element.querySelector(':scope > div.w-layout-grid');
  if (!columnsGrid) return; // safety check
  
  // Get direct children of the main columns grid
  const colChildren = Array.from(columnsGrid.children);

  // One is a div (with all content), one is the image
  let contentBlock = null;
  let imageBlock = null;

  colChildren.forEach((child) => {
    if (child.tagName === 'DIV' && !contentBlock) {
      contentBlock = child;
    } else if (child.tagName === 'IMG' && !imageBlock) {
      imageBlock = child;
    }
  });
  
  // Inside the contentBlock, there is a single DIV containing the heading, text, and buttons
  // Sometimes another wrapping grid
  if (contentBlock && contentBlock.children.length === 1 && contentBlock.children[0].tagName === 'DIV') {
    contentBlock = contentBlock.children[0];
  }

  // Table header row MUST match example
  const headerRow = ['Columns (columns23)'];
  // Table content row: [content, image]
  const blockRows = [headerRow, [contentBlock, imageBlock]];
  const table = WebImporter.DOMUtils.createTable(blockRows, document);
  element.replaceWith(table);
}
