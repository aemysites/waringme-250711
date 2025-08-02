/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Hero (hero34)'];

  // 2nd row: background image (none in this HTML)
  const bgImageRow = [''];

  // 3rd row: content
  // Extract the heading (h2, any text inside)
  const h2 = element.querySelector('h2');
  // Extract the subheading/paragraph (the div with class text__TextElement-sc-qf7y4e-0.jVKIid)
  const subheading = element.querySelector('.text__TextElement-sc-qf7y4e-0.jVKIid');

  // Compose the content cell
  // If both exist, stack them in an array, preserving order and reference
  const contentParts = [];
  if (h2) contentParts.push(h2);
  if (subheading) contentParts.push(subheading);
  // If neither, push empty string so there's always a cell
  if (contentParts.length === 0) contentParts.push('');

  const tableRows = [
    headerRow,
    bgImageRow,
    [contentParts]
  ];

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
