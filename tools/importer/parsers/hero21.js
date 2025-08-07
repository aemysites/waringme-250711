/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per spec
  const headerRow = ['Hero (hero21)'];

  // Collect direct children for image and heading
  const children = Array.from(element.children);

  // Find the first image
  const img = children.find((child) => child.tagName === 'IMG') || '';
  // Find the first heading element (h1-h6)
  const heading = children.find((child) => /^H[1-6]$/.test(child.tagName)) || '';

  // Table rows in the right order
  const cells = [
    headerRow,       // header
    [img],           // background image row (may be blank)
    [heading]        // content row (may be blank)
  ];

  // Build the block table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
