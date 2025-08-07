/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure we reference existing elements only
  // Header row: block name exactly as shown in example
  const headerRow = ['Hero (hero1)'];
  // 2nd row: background image is optional and not present in this HTML, so cell is empty string
  const backgroundRow = [''];
  // 3rd row: headline, CTAs, secondary link (all content in one cell)
  // Collect all children as per structure, preserving their order and reference
  const cellsContent = [];
  const children = Array.from(element.children);
  for (let i = 0; i < children.length; i++) {
    cellsContent.push(children[i]);
  }
  // Compose the table
  const cells = [
    headerRow,
    backgroundRow,
    [cellsContent]
  ];
  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
