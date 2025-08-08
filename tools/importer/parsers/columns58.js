/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main flex container
  const flex = element.querySelector('[data-skyui-core^="Flex"]');
  if (!flex) return;
  // The expected structure: flex has two children
  const children = flex.children;
  if (children.length < 2) return;

  // First column: result count (e.g., "39 results")
  const resultsCol = children[0];
  // Second column: sort controls
  const sortCol = children[1];

  // For robustness, create wrappers for each column's content to preserve layout if needed
  const resultsDiv = document.createElement('div');
  resultsDiv.append(...resultsCol.childNodes.length ? Array.from(resultsCol.childNodes) : []);

  const sortDiv = document.createElement('div');
  sortDiv.append(...sortCol.childNodes.length ? Array.from(sortCol.childNodes) : []);

  // Compose the table: header, then columns (results | sort)
  const headerRow = ['Columns (columns58)', ''];
  const contentRow = [resultsDiv, sortDiv];
  const cells = [headerRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
