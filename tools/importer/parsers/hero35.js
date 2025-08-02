/* global WebImporter */
export default function parse(element, { document }) {
  // Define the header row exactly as in the example
  const headerRow = ['Hero (hero35)'];
  
  // Background image row: none present in input HTML, so empty string
  const backgroundImageRow = [''];

  // Content row: extract all relevant heading and paragraph-like content inside the block
  // To be robust, get all headings, paragraphs, and any direct children with text
  const contentElems = [];
  // Collect all headings and paragraphs from within the block, in source order
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node) => {
      if (/^H[1-6]$/i.test(node.tagName) || node.tagName === 'P') return NodeFilter.FILTER_ACCEPT;
      return NodeFilter.FILTER_SKIP;
    }
  });
  let node = walker.nextNode();
  while (node) {
    contentElems.push(node);
    node = walker.nextNode();
  }
  // If there are no headings or paragraphs, use all immediate children (fallback for edge case)
  if (contentElems.length === 0) {
    Array.from(element.children).forEach(child => contentElems.push(child));
  }
  
  // If still nothing, just use the original element as is (extreme edge case)
  if (contentElems.length === 0) {
    contentElems.push(element);
  }

  // Table cells: header, background image, content
  const cells = [
    headerRow,
    backgroundImageRow,
    [contentElems]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
