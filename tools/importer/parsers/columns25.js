/* global WebImporter */
export default function parse(element, { document }) {
  // The 'columns25' block is the only table needed, per the example
  // Find the main grid containing columns (two columns)
  const container = element.querySelector('.container');
  if (!container) return;
  const grid = container.querySelector('.w-layout-grid.grid-layout.mobile-landscape-1-column.grid-gap-sm.y-bottom');
  if (!grid) return;

  // First column: collect the heading, author/testimonial vertical stack (left side)
  const h2 = grid.querySelector('.h2-heading');
  const quote = grid.querySelector('.paragraph-lg');
  const attributionGrid = grid.querySelector('.w-layout-grid.grid-layout.mobile-landscape-1-column.grid-gap-sm');
  let authorBlock = null;
  let logoBlock = null;
  if (attributionGrid) {
    // .divider, .flex-horizontal (author), .utility-display-inline-block (logo)
    const flexHoriz = attributionGrid.querySelector('.flex-horizontal');
    authorBlock = flexHoriz || null;
    const svgDiv = attributionGrid.querySelector('.utility-display-inline-block');
    logoBlock = svgDiv || null;
  }

  // Build left and right column content as arrays, maintaining original elements
  const leftCol = [];
  if (h2) leftCol.push(h2);
  if (authorBlock) leftCol.push(authorBlock);
  const rightCol = [];
  if (quote) rightCol.push(quote);
  if (logoBlock) rightCol.push(logoBlock);

  // Compose table structure per block guidelines and example
  const cells = [
    ['Columns (columns25)'],
    [leftCol, rightCol],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
