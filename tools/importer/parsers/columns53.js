/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main horizontal Flex container
  const flexMain = element.querySelector('.flex__Flex-sc-1r1ee79-0.jhyXem');
  if (!flexMain) return;
  const columns = flexMain.querySelectorAll(':scope > .flex__Flex-sc-1r1ee79-0');
  if (columns.length !== 2) return;

  // In the visual example, the left cell is the content, right is the image
  // But in the provided HTML, columns[0] is image, columns[1] is content - so we need to swap
  const imageCol = columns[0];
  const contentCol = columns[1];

  // Get the image element from the imageCol
  const img = imageCol.querySelector('img');
  // The right cell is the contentCol's first child (contains all content)
  // We want to extract the main 'box' with the heading and everything else
  // The column contains a .box__Box-sc-1i8zs0c-0.jnHuVl, grab that
  let contentBox = contentCol.querySelector('.box__Box-sc-1i8zs0c-0.jnHuVl');
  // If not found, fallback to the whole column
  if (!contentBox) contentBox = contentCol;

  // Build the table: header row, then content row [content, image]
  const cells = [
    ['Columns (columns53)'],
    [contentBox, img]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
