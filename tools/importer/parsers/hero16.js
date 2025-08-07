/* global WebImporter */
export default function parse(element, { document }) {
  // Header as per the example
  const headerRow = ['Hero (hero16)'];
  // Second row is for background image. Not present in this HTML.
  const bgRow = [''];

  // Third row: headline, subheading, CTA (all text and button)
  // The relevant content is all direct children of the deepest Flex container in the tree
  let contentCell = [''];
  // Find the deepest Flex container (likely contains the content and CTA)
  let flex = null;
  // Prefer class names with flex__Flex or data-skyui-core contains Flex
  // Get all Flex containers and pick the deepest one
  const flexCandidates = element.querySelectorAll('[class*="flex__Flex"], [data-skyui-core*="Flex"]');
  if (flexCandidates.length) {
    flex = flexCandidates[flexCandidates.length - 1];
  }
  if (flex) {
    // We want to preserve all content (text, spans, links) inside this Flex container
    // Reference the actual DOM nodes (not clones)
    const contents = [];
    flex.childNodes.forEach(node => {
      // Only include non-empty text nodes or elements
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = node.textContent;
          contents.push(span);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        contents.push(node);
      }
    });
    if (contents.length > 0) {
      contentCell = [contents];
    }
  } else {
    // Fallback: all text inside the element
    const txt = element.textContent.trim();
    if (txt) contentCell = [txt];
  }

  const cells = [headerRow, bgRow, contentCell];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
