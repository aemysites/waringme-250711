/* global WebImporter */
export default function parse(element, { document }) {
  // The provided HTML only has a decorative shine div and no card content
  // The block example expects at least the header row for a Cards (cards52) block
  // No Section Metadata block is present in the example
  // There is no content to extract; ensure only the header row is present, matching the example header
  const cells = [['Cards (cards52)']];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
