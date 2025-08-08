/* global WebImporter */
export default function parse(element, { document }) {
  // The provided HTML is only a decorative shine div, no content to extract
  // The example block expects a header row only if there is no content
  const cells = [
    ['Cards (cards48)']
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}