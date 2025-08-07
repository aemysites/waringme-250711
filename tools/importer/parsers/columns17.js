/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must match exactly as specified
  const headerRow = ['Columns (columns17)'];

  // Find the grid that has the two columns
  const gridDiv = element.querySelector('.grid__Grid-sc-ysk8de-0');
  if (!gridDiv) return;

  // The grid has two children: left (instructions & ctas), right (image)
  // Get all immediate children (divs and img)
  const columns = Array.from(gridDiv.children);
  if (columns.length < 2) return;

  // FIRST COLUMN: instructions + CTAs
  const leftDiv = columns[0];
  let leftCellContent = [];
  if (leftDiv) {
    // Get the container with h2 and the instructions (first flex)
    const instructionContainer = leftDiv.querySelector('.flex__Flex-sc-1r1ee79-0.dBIWYo');
    if (instructionContainer) leftCellContent.push(instructionContainer);
    // Get the CTAs (second flex)
    const ctaContainer = leftDiv.querySelector('.flex__Flex-sc-1r1ee79-0.hJtFpA');
    if (ctaContainer) leftCellContent.push(ctaContainer);
  }

  // SECOND COLUMN: image
  // Usually an <img> as the second child
  let rightCellContent = columns[1] ?? null;

  // Defensive: if the right column is not an <img>, check for an image inside
  if (rightCellContent && rightCellContent.tagName !== 'IMG') {
    const img = rightCellContent.querySelector('img');
    if (img) rightCellContent = img;
  }

  // Assemble table row
  const row = [leftCellContent, rightCellContent];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    row
  ], document);

  element.replaceWith(table);
}
