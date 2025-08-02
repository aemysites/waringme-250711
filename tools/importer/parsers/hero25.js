/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the Hero (hero25) block
  const headerRow = ['Hero (hero25)'];

  // This input HTML is an empty container div (no child content) based on the provided code
  // So we have no image, title, subtitle, paragraph, or CTA to extract
  // Edge case: all rows (other than header) will be empty

  const backgroundImageRow = ['']; // No background image present
  const contentRow = [''];         // No text content present

  // Compose the table for the Hero (hero25) block
  const cells = [
    headerRow,
    backgroundImageRow,
    contentRow,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}