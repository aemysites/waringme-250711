/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell (one column), as in the example
  const headerRow = ['Columns (columns16)'];

  // Get the relevant content blocks for each column
  // The blocks are the children of the inner container
  const container = element.querySelector(':scope > div');
  if (!container) return;
  const featureDivs = Array.from(container.querySelectorAll(':scope > [data-test-id^="feature-"]'));

  // Each column can contain an array of its content: image, and optionally a label
  const columnsRow = featureDivs.map(featureDiv => {
    // The content is inside a flex container
    const flex = featureDiv.querySelector('.flex__Flex-sc-1r1ee79-0');
    if (!flex) return '';
    const img = flex.querySelector('img');
    const txt = flex.querySelector('p');
    const content = [];
    if (img) content.push(img);
    if (txt) content.push(txt);
    return content.length === 1 ? content[0] : content;
  });

  // Table structure: first row header (1 col), second row: all columns in a single row
  // This matches the example markdown structure (header row spans all columns)
  const tableCells = [headerRow, columnsRow];

  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
