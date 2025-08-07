/* global WebImporter */
export default function parse(element, { document }) {
  // The goal is to extract two columns: 
  // Left: the image
  // Right: the heading, subheading, description, 'Learn More' link, and app store badges.

  // Find the immediate container with the two columns (flex)
  // The structure is
  // section > div.container > div.flex > div.flex (content)
  const mainFlex = element.querySelector('div[data-test-id="single-image-block-content"]');
  if (!mainFlex) return;

  // First column: image (inside a box > img)
  const leftBox = mainFlex.querySelector(':scope > div:first-child');
  let leftImg = null;
  if (leftBox) {
    leftImg = leftBox.querySelector('img');
  }

  // Second column: all the text and links (the rest of the mainFlex)
  // This is the second `.box__Box-sc-1i8zs0c-0.iXImqc` sibling
  const rightBox = mainFlex.querySelector(':scope > div:last-child');
  let rightContent = null;
  if (rightBox) {
    // We want all of rightBox's content as the right column
    rightContent = rightBox;
  }

  const headerRow = ['Columns (columns3)'];
  const cellsRow = [leftImg, rightContent];
  const cells = [headerRow, cellsRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
