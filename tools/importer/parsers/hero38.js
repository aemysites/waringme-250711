/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header (block name)
  const headerRow = ['Hero (hero38)'];

  // 2. Background Image Row: Should be just the main hero image if present
  // Try to find a top-level grid-layout > div > img which has an appropriate class for background/cover
  let bgImg = null;
  const gridDivs = element.querySelectorAll('.w-layout-grid.grid-layout > div');
  for (const div of gridDivs) {
    const img = div.querySelector('img.cover-image, img');
    if (img) {
      bgImg = img;
      break;
    }
  }

  // 3. Content Row: find container with text, button, headings
  // The content is in the .container utility-position-relative div
  let contentContainer = null;
  const containers = element.querySelectorAll('.container.utility-position-relative');
  if (containers.length) {
    contentContainer = containers[0];
  } else {
    // fallback: second grid-layout child, as per observed pattern
    const grids = element.querySelectorAll('.w-layout-grid.grid-layout');
    if (grids.length > 1) {
      // Find the first grid child that isn't the one holding the image
      for (let i = 1; i < grids.length; i++) {
        if (grids[i].contains(element.querySelector('h1'))) {
          contentContainer = grids[i];
          break;
        }
      }
      if (!contentContainer) contentContainer = grids[1];
    }
  }

  // Assemble block table as per spec: 1 col, 3 rows
  const cells = [
    headerRow,
    [bgImg ? bgImg : ''],
    [contentContainer ? contentContainer : '']
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}