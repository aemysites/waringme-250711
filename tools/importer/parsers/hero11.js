/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Hero (hero11)'];

  // Second row: Background image (use the first image present in the block)
  let backgroundImg = null;
  const divs = element.querySelectorAll(':scope > div');
  for (const div of divs) {
    const img = div.querySelector('img');
    if (img) {
      backgroundImg = img;
      break;
    }
  }

  // Third row: There is no headline, subheading, or CTA in the provided HTML
  // so this row will be an empty string

  const cells = [
    headerRow,
    [backgroundImg ? backgroundImg : ''],
    [''],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
