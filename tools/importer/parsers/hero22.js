/* global WebImporter */
export default function parse(element, { document }) {
  // The provided element is an empty box container.
  // According to the requirements, we must build a Hero (hero22) block with the right table structure.
  // Since there is no child content (no image, no heading, etc.), we must output 3 rows: header, image, and content, all empty except the header.
  const headerRow = ['Hero (hero22)'];
  const imageRow = [''];
  const contentRow = [''];
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}