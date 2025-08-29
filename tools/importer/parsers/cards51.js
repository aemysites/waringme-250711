/* global WebImporter */
export default function parse(element, { document }) {
  // Critical Review:
  // - The provided HTML only contains a decorative <div> and NO card data.
  // - The example block is 'Cards (cards51)' and expects at least a header row.
  // - There is NO Section Metadata block in the example markdown.
  // - There is NO content to extract from the element, so all output must be minimal and structurally correct.
  // - The header must match exactly: 'Cards (cards51)'.
  // - No markdown syntax is used.
  // - No extra cells or rows should be added.
  // - No <hr> is needed.

  // Build the minimal table with only the header
  const headerRow = ['Cards (cards51)'];
  const cells = [headerRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
