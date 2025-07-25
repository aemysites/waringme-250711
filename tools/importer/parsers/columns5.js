/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct children: each is a column container
  const columnDivs = Array.from(element.querySelectorAll(':scope > div'));

  // For each column container, extract its content (the image)
  // If no image, leave cell empty
  const columns = columnDivs.map(div => {
    const img = div.querySelector('img');
    return img ? img : '';
  });

  // Always use the exact header name as per spec
  const cells = [
    ['Columns (columns5)'],
    columns
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}