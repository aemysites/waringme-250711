/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for block table, as per instructions and markdown example
  const headerRow = ['Columns (columns56)'];

  // Defensive extraction for two columns, as the HTML is structured as:
  // <div> <span>9 plans</span> <div>[Sort Controls]</div> </div>
  // There may be variations, so we check for child count.
  const leftContent = element.children[0] ? element.children[0] : document.createTextNode('');
  const rightContent = element.children[1] ? element.children[1] : document.createTextNode('');

  // Structure: one header row, one row with two columns, both referencing existing elements
  const cells = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create and replace block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
