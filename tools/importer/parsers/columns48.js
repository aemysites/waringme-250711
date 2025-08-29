/* global WebImporter */
export default function parse(element, { document }) {
  // Helper function to flatten Markdown blocks so all text is present
  function flattenMarkdown(el) {
    if (!el) return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_ELEMENT, null, false);
    const toReplace = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.getAttribute && node.getAttribute('data-skyui-core') === 'Markdown@11.8.1') {
        toReplace.push(node);
      }
    }
    toReplace.forEach(md => {
      const span = document.createElement('span');
      span.innerHTML = md.innerHTML;
      md.replaceWith(span);
    });
  }

  // Find the product row (the row containing product columns)
  let productRow = null;
  let tableRoot = element.querySelector('[role="treegrid"]');
  if (tableRoot) {
    // Find product row as the first rowgroup
    let rowGroups = Array.from(tableRoot.querySelectorAll('li[role="rowgroup"]'));
    if (rowGroups.length) {
      productRow = rowGroups[0].querySelector('ul[role="row"]');
    }
  }
  // Fallback: find the sticky header row directly
  if (!productRow) {
    productRow = element.querySelector('.sticky-header__StickyHeaderScrollAreaElement-sc-i1imja-0 ul.header__HeaderRowElement-sc-jqig4l-1');
  }

  // The header row must be a single cell with the block name
  const headerRow = ['Columns (columns48)'];

  // Compose the product columns row (second row), as many cells as there are products
  let productCells = [];
  if (productRow) {
    // Each <li> after the first is a column for a product
    const lis = Array.from(productRow.children).slice(1);
    productCells = lis.map(li => {
      // Reference all child nodes (text and elements)
      const wrapper = document.createElement('div');
      Array.from(li.childNodes).forEach(child => wrapper.append(child));
      flattenMarkdown(wrapper);
      // If only text, return text directly
      if (wrapper.childNodes.length === 1 && wrapper.firstChild.nodeType === 3) {
        return wrapper.textContent.trim();
      }
      return wrapper;
    });
  }
  const numCols = productCells.length;

  // Now gather all the comparison rows (the actual data rows)
  // Each row group after the first is a comparison row
  let comparisonRows = [];
  if (tableRoot) {
    let rowGroups = Array.from(tableRoot.querySelectorAll('li[role="rowgroup"]'));
    for (let i = 1; i < rowGroups.length; i++) {
      const row = rowGroups[i].querySelector('ul[role="row"]');
      if (!row) continue;
      const cells = Array.from(row.children).slice(1, 1+numCols).map(cell => {
        // Reference all content in the cell
        const wrapper = document.createElement('div');
        Array.from(cell.childNodes).forEach(child => wrapper.append(child));
        flattenMarkdown(wrapper);
        if (wrapper.childNodes.length === 1 && wrapper.firstChild.nodeType === 3) {
          return wrapper.textContent.trim();
        }
        return wrapper;
      });
      // If row has fewer cells than product columns, pad so table is rectangular
      while (cells.length < numCols) cells.push('');
      comparisonRows.push(cells);
    }
  }

  // Build the table array: header row (1 col), product row, then each feature row
  const cells = [headerRow, productCells, ...comparisonRows];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
