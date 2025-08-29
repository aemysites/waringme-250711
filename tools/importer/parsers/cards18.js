/* global WebImporter */
export default function parse(element, { document }) {
  // The element is a decorative shine div, with no card/content children.
  // No need to extract any dynamic content, just create an empty block with the correct header.
  const cells = [
    ['Cards (cards18)']
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
