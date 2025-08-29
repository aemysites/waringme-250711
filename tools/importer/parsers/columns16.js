/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: matches example
  const headerRow = ['Columns (columns16)'];

  // Find the UL containing columns
  const ul = element.querySelector('ul');
  const columns = [];
  if (ul) {
    const lis = ul.querySelectorAll(':scope > li');
    lis.forEach((li) => {
      // In each li, the box contains the content
      // We'll extract the 'grid' content, which contains all visual elements for a column
      const box = li.querySelector(':scope > div');
      let cellContent = [];
      if (box) {
        // Find the intersection animator div
        const animator = box.querySelector(':scope > div');
        if (animator) {
          // Find the grid containing actual contents
          const grid = animator.querySelector(':scope > div');
          if (grid) {
            // Get all content inside grid, in order
            Array.from(grid.childNodes).forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                // reference the existing node directly
                cellContent.push(node);
              }
            });
          }
        }
      }
      if (cellContent.length === 0) {
        // If somehow empty, include the li for fallback
        cellContent = [li];
      }
      columns.push(cellContent.length === 1 ? cellContent[0] : cellContent);
    });
  }

  // Compose block table: header, then a single row with N columns
  const cells = [
    headerRow,
    columns
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
