/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Unwrap 'Markdown' elements recursively, preserving HTML structure and text
  function unwrapMarkdown(node) {
    if (!node) return null;
    if (node.nodeType === 1 && node.getAttribute('data-skyui-core') && node.getAttribute('data-skyui-core').startsWith('Markdown@')) {
      // Unwrap this node, recurse for children
      const fragment = document.createDocumentFragment();
      Array.from(node.childNodes).forEach(child => {
        const unwrapped = unwrapMarkdown(child);
        if (unwrapped) fragment.appendChild(unwrapped);
      });
      return fragment;
    } else if (node.nodeType === 1) {
      // For elements, recursively unwrap children in place
      Array.from(node.childNodes).forEach(child => {
        const unwrapped = unwrapMarkdown(child);
        if (unwrapped && child !== unwrapped) child.replaceWith(unwrapped);
      });
      return node;
    }
    // For text or other nodes, just return
    return node;
  }

  // Compose all content for a column, referencing existing nodes
  function getColumnContent(colIdx) {
    const columnFragment = document.createDocumentFragment();
    // Get the header cell (skip first columnheader, it's empty)
    const headerRow = element.querySelector('ul.header__HeaderRowElement-sc-jqig4l-1.gZDwIc');
    if (headerRow) {
      const headerCells = headerRow.querySelectorAll('li[role="columnheader"]');
      if (headerCells.length > colIdx + 1) {
        // Unwrap markdown in header cell and append
        const headerCellContent = headerCells[colIdx + 1];
        if (headerCellContent) {
          Array.from(headerCellContent.childNodes).forEach(child => {
            const unwrapped = unwrapMarkdown(child);
            if (unwrapped) columnFragment.appendChild(unwrapped);
          });
        }
      }
    }
    // Now process each data row
    const rowGroups = element.querySelectorAll('ul[role="row"]');
    rowGroups.forEach(row => {
      const cells = row.querySelectorAll('li');
      if (cells.length > colIdx + 1) {
        const cell = cells[colIdx + 1];
        if (cell) {
          // Unwrap markdown in each cell and append
          Array.from(cell.childNodes).forEach(child => {
            const unwrapped = unwrapMarkdown(child);
            if (unwrapped) columnFragment.appendChild(unwrapped);
          });
        }
      }
    });
    // Wrap in a div for the cell
    const wrapper = document.createElement('div');
    wrapper.appendChild(columnFragment);
    return wrapper;
  }

  // Header row as per the example
  const headerRow = ['Columns (columns14)'];

  // Get both columns' content, referencing actual nodes
  const leftCol = getColumnContent(0);
  const rightCol = getColumnContent(1);

  // Build the block table: one header row, then one content row with two columns
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [leftCol, rightCol]
  ], document);

  // Replace original element
  element.replaceWith(table);
}
