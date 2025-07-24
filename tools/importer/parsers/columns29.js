/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid layout containing the columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get the direct children of the grid (columns)
  // We expect:
  // 0: Taylor Brooks
  // 1: tag list (Casual Vibes, Sporty Looks, Party Ready)
  // 2: h2 title
  // 3: rich text body
  // We'll build three columns: (name+tags), (title), (body)

  const children = Array.from(grid.children);

  // Defensive handling if grid has fewer than 4 children
  // Create wrappers for each column
  const col1 = document.createElement('div');
  if (children[0]) col1.appendChild(children[0]);
  if (children[1]) col1.appendChild(children[1]);

  const col2 = document.createElement('div');
  if (children[2]) col2.appendChild(children[2]);

  const col3 = document.createElement('div');
  if (children[3]) col3.appendChild(children[3]);

  // Build the table header
  const headerRow = ['Columns (columns29)'];
  // Second row: columns content
  const columnsRow = [col1, col2, col3];

  const cells = [headerRow, columnsRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the entire section with the block
  element.replaceWith(block);
}
