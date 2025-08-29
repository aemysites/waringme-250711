/* global WebImporter */
export default function parse(element, { document }) {
  // The example requires that each column cell contains a block of content for the column
  // The input HTML lays out swatches horizontally: visually, each swatch is a column
  // But the example expects to treat a logical group (here, a swatch button with its SVG checkmark) as one column
  // We must create one header row (single cell), then a single row with one cell for each column

  // 1. Find all swatch column containers
  // The direct children of the first child of 'element' are the swatch containers
  let swatchRow = null;
  if (element.children.length > 0) {
    swatchRow = element.children[0];
  }
  // Defensive: fallback to 'element' if not found
  if (!swatchRow) swatchRow = element;

  // Each swatch is a div[data-test-id=radial-swatch-active] or [data-test-id=radial-swatch]
  const swatchCols = Array.from(swatchRow.children).filter(el => {
    const testId = el.getAttribute('data-test-id');
    return testId === 'radial-swatch-active' || testId === 'radial-swatch';
  });

  // The play/pause button is the last child of element
  let playPause = null;
  if (element.children.length > 1) {
    playPause = element.children[element.children.length - 1];
  }
  // Only add to columns if it actually is the button
  if (playPause && playPause.getAttribute('data-test-id') !== 'gallery-play-pause-button') playPause = null;

  // Compose columns: all swatches, then the pause button if present
  const columns = [...swatchCols];
  if (playPause) columns.push(playPause);

  // If nothing found, just use all children as fallback
  const colCells = columns.length > 0 ? columns : Array.from(element.children);

  // Table structure: header row, then row with each column's content in its own cell
  const cells = [
    ['Columns (columns31)'],
    colCells
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
