/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified in the example
  const headerRow = ['Hero (hero47)'];

  // Second row: Background image, not present in this HTML, so blank string
  const bgRow = [''];

  // Third row: Content row, should include all main content from the element
  // The spec and example combine all content into a single cell
  // Per the HTML input, there are two elements: h3 (overline), h2 (main heading)
  // We'll reference these directly
  const h3 = element.querySelector('h3');
  const h2 = element.querySelector('h2');

  // Prepare the array of elements, skipping nulls (in case any are missing)
  const content = [h3, h2].filter(Boolean);
  
  const contentRow = [content];

  // Create the table according to the block structure
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgRow,
    contentRow
  ], document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
