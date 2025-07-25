/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure we find the correct grid block inside the section
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  const columns = Array.from(grid.children);

  // Defensive: only proceed with at least two columns (since it's a Columns block)
  if (columns.length < 2) return;

  // Table header as required by example
  const headerRow = ['Columns (columns31)'];
  // Table second row: one cell per column (reference the original element, do not clone)
  const contentRow = columns;

  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  
  element.replaceWith(table);
}
