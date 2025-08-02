/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Hero (hero23)'];

  // Background image row (none in the provided HTML example)
  const backgroundRow = [''];

  // Content row: fetch the relevant content (headline/subheadline/CTA)
  // The actual content is inside the innermost .flex__Flex-sc-1r1ee79-0
  let contentCell;
  // Try to find the innermost flex container with the text and CTA
  const flexContent = element.querySelector('.flex__Flex-sc-1r1ee79-0');
  if (flexContent) {
    contentCell = flexContent;
  } else {
    // fallback: use all children of the element
    // Usually, the structure is section > div > div > flexdiv
    // We'll put all immediate children into a wrapper div for the cell
    const wrapper = document.createElement('div');
    // get all non-empty immediate children
    Array.from(element.children).forEach(child => {
      if (child.textContent.trim() !== '' || child.querySelector('*')) {
        wrapper.appendChild(child);
      }
    });
    contentCell = wrapper;
  }

  const contentRow = [contentCell];

  // Compose the table
  const cells = [headerRow, backgroundRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
