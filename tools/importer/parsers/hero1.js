/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: safely get immediate child by selector
  function getImmediateChild(parent, selector) {
    return Array.from(parent.children).find(el => el.matches(selector));
  }

  // 1. Header row: exact string as required
  const headerRow = ['Hero (hero1)'];

  // 2. Background image row: not present in this HTML, so empty
  const imageRow = [''];

  // 3. Content row: should include logo and headline
  // According to HTML, h1 contains all relevant content
  // We reference the existing h1 element (do not clone)
  const h1 = element.querySelector('h1');
  let contentRow;
  if (h1) {
    contentRow = [h1];
  } else {
    // If h1 not found, leave cell empty
    contentRow = [''];
  }

  // Compose the table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
