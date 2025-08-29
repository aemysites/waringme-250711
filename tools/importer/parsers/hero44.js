/* global WebImporter */
export default function parse(element, { document }) {
  // Block header exactly as required
  const headerRow = ['Hero (hero44)'];

  // Background image row - not present for this HTML
  const bgImageRow = [''];

  // Find content row: Should contain the headline (as heading element)
  // The structure is several nested divs; heading is inside (a h2 containing a span)
  let content = '';
  // Find the first heading element inside the block
  const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    content = heading;
  } else {
    // fallback: use the full element, which will output all text as a single block
    content = element;
  }

  // Output 1 column, 3 rows (header, bg image, content)
  const rows = [headerRow, bgImageRow, [content]];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}