/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block specification
  const headerRow = ['Hero (hero37)'];
  // Background image row (empty in this case)
  const bgRow = [''];

  // Content row: collect all heading, subheading, cta or text nodes, as per spec
  // In the sample HTML, the hero only has a heading (h2) with a span inside
  // We want to preserve the existing heading semantics
  let contentElements = [];

  // Gather all top-level headings and content in the hero area
  // In this HTML, the heading is in a h2 inside nested divs
  // Per instructions, reference the existing heading element if present
  // To be robust, we collect all heading elements (h1-h6) and paragraphs (if present)
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
  if (headings.length > 0) {
    headings.forEach(h => contentElements.push(h));
  }
  // Optionally add paragraphs (in this HTML, there are none, but may be present in others)
  const paragraphs = element.querySelectorAll('p');
  if (paragraphs.length > 0) {
    paragraphs.forEach(p => contentElements.push(p));
  }
  // If no headings or paragraphs found, fallback to including all children (robust for variations)
  if (contentElements.length === 0) {
    // If the element has only one child, just use it
    if (element.children.length === 1) {
      contentElements = [element.firstElementChild];
    } else {
      // Include all child nodes
      contentElements = Array.from(element.childNodes);
    }
  }

  const contentRow = [contentElements];

  const cells = [
    headerRow,
    bgRow,
    contentRow,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
