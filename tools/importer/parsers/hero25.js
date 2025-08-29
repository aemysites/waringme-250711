/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: matches the block name exactly
  const headerRow = ['Hero (hero25)'];

  // Background image row: none present in HTML, leave blank
  const backgroundImageRow = [''];

  // Content row: find immediate children of flex container
  const flexDiv = element.querySelector(':scope > div');
  let contentRow;
  if (flexDiv) {
    // Collect all non-empty element children (span, a, etc)
    const contents = Array.from(flexDiv.childNodes).filter(node => {
      if (node.nodeType === Node.ELEMENT_NODE) return true;
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) return true;
      return false;
    });
    // If there is any content, use it; else use an empty string
    contentRow = [contents.length ? contents : ''];
  } else {
    contentRow = [''];
  }

  // Build the table
  const cells = [headerRow, backgroundImageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with the table
  element.replaceWith(table);
}
