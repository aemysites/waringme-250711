/* global WebImporter */
export default function parse(element, { document }) {
  // This element is only a decorative shine/background block with no content.
  // There are no cards or any relevant content to extract.
  // As such, the output should be a block table with only the header row, as per the spec.
  const headerRow = ['Cards (cardsNoImages18)'];
  const table = WebImporter.DOMUtils.createTable([headerRow], document);
  element.replaceWith(table);
}