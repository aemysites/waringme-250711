/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get the first direct child matching selector
  function firstChild(parent, selector) {
    return parent ? Array.from(parent.children).find(el => el.matches(selector)) : null;
  }

  // Header row
  const headerRow = ['Carousel (carousel35)'];

  // The main grid (2 columns: text + images)
  const mainGrid = element.querySelector('.w-layout-grid.grid-layout.tablet-1-column');
  if (!mainGrid) return;
  const [textCol, imgCol] = Array.from(mainGrid.children);

  // Find the image grid (should have only img children)
  const imageGrid = imgCol && imgCol.querySelector('.w-layout-grid');
  const images = imageGrid ? Array.from(imageGrid.querySelectorAll('img')) : [];

  // Get text for the first slide
  let textCell = [];
  if (textCol) {
    // Heading
    let heading = textCol.querySelector('h1, .h1-heading');
    if (heading) {
      const h2 = document.createElement('h2');
      h2.innerHTML = heading.innerHTML;
      textCell.push(h2);
    }
    // Subheading/paragraph
    let para = textCol.querySelector('p, .subheading');
    if (para) textCell.push(para);
    // Button group (may have multiple links)
    let btnGroup = textCol.querySelector('.button-group');
    if (btnGroup) textCell.push(btnGroup);
  }
  // If nothing, keep as empty string for cell
  if (textCell.length === 0) textCell = '';

  // Build cells: Header first
  const cells = [headerRow];
  images.forEach((img, idx) => {
    if (idx === 0) {
      // First slide gets the text
      cells.push([img, textCell]);
    } else {
      cells.push([img, '']);
    }
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
