/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main flex container for the two columns (image left, content right)
  const mainFlex = element.querySelector('[data-test-id="single-image-block-content"]');
  if (!mainFlex) return;

  // Get the two direct children of the flex container (expected: image column, content column)
  const cols = Array.from(mainFlex.children);
  if (cols.length < 2) return;

  // First column: the image (reference the entire element)
  const col1 = cols[0];

  // Second column: all text, headings, body and app badge links (reference the entire container)
  const col2 = cols[1];

  // Build the block table as per the Columns (columns16) block
  const cells = [
    ['Columns (columns16)'],
    [col1, col2]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
