/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero27)'];

  // 2. Extract the background image (if present)
  // Prefer the <picture> element if it exists
  let imageCell = null;
  const picture = element.querySelector('picture');
  if (picture) {
    imageCell = picture;
  } else {
    const img = element.querySelector('img');
    if (img) imageCell = img;
  }

  // 3. Extract the text/button content (second cell)
  // Try to find the main content container with headings, description, CTAs
  // It's always in a '.position__Position-sc-egiw9v-0' div
  let contentCell = null;
  const positionDiv = element.querySelector('.position__Position-sc-egiw9v-0');
  if (positionDiv) {
    contentCell = positionDiv;
  } else {
    // fallback: use remaining content except any picture/image
    contentCell = document.createElement('div');
    Array.from(element.children).forEach((child) => {
      if (!(child.tagName === 'PICTURE' || child.querySelector('img')))
        contentCell.appendChild(child);
    });
  }

  // Compose block table rows
  const cells = [
    headerRow,
    [imageCell],
    [contentCell],
  ];

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
