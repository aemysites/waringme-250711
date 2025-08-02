/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row as specified
  const cells = [
    ['Hero (hero16)'],
    [''], // No background image present in provided HTML
    []
  ];

  // Get the flex container with the text and button
  const contentContainer = element.querySelector('.flex__Flex-sc-1r1ee79-0');
  if (contentContainer) {
    // We'll collect all children in order
    const content = [];
    contentContainer.childNodes.forEach((node) => {
      // Only add element nodes or non-empty text nodes
      if (node.nodeType === Node.ELEMENT_NODE) {
        content.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
        const span = document.createElement('span');
        span.textContent = node.textContent;
        content.push(span);
      }
    });
    if (content.length > 0) {
      cells[2].push(content);
    } else {
      cells[2].push('');
    }
  } else {
    cells[2].push(''); // If for some reason no content found
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
