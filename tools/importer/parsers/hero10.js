/* global WebImporter */
export default function parse(element, { document }) {
  // The source HTML contains only the content (no background image).
  // The block wants all content (headings, subheadings, etc) in row 3 cell.

  // Collect all direct children of the element for content preservation
  const content = Array.from(element.childNodes)
    .filter(node =>
      node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())
    );

  // If only text nodes, combine into a single <p>
  let cellContent;
  if (content.length === 0) {
    cellContent = '';
  } else if (content.every(n => n.nodeType === Node.TEXT_NODE)) {
    const p = document.createElement('p');
    p.textContent = content.map(n => n.textContent).join(' ');
    cellContent = p;
  } else {
    cellContent = content;
  }

  const cells = [
    ['Hero (hero10)'], // header row, exactly as in the example
    [''],              // row for background image; empty since none in HTML
    [cellContent]      // row for text content: all content nodes from input
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
