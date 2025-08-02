/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row: must match the example exactly.
  const headerRow = ['Hero (hero38)'];

  // Second row: background image. Not present in this HTML, so pass an empty string (as in the markdown example)
  const backgroundRow = [''];

  // Third row: title, subheading, CTA etc
  // We'll extract all visible heading and paragraph elements (h1-h6, p), keeping document order, and any links (for CTA)
  // Reference the actual elements from the DOM, not clones
  // To be robust, look for all headings and paragraphs inside the block, in DOM order
  const allowedTags = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'A', 'BUTTON'];
  const contentElems = [];

  // Use a TreeWalker to keep elements in DOM order
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node) => allowedTags.includes(node.tagName) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
  });
  let currentNode = walker.nextNode();
  while (currentNode) {
    contentElems.push(currentNode);
    currentNode = walker.nextNode();
  }

  // If nothing found, fallback to the whole element
  const contentRow = [contentElems.length ? contentElems : [element]];

  // Build the table
  const cells = [headerRow, backgroundRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
