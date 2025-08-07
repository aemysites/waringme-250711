/* global WebImporter */
export default function parse(element, { document }) {
  // The block expects a single table with header 'Columns (columns29)',
  // and one row with as many columns as there are swatches.
  // Each swatch is a direct child of the inner Flex container, identified by data-test-id="radial-swatch-active" or "radial-swatch".

  // Find the container holding the swatches (the first direct child Flex of the main block)
  const innerFlex = element.querySelector(':scope > .flex__Flex-sc-1r1ee79-0');
  // If not found, just use the passed element (edge case safety)
  const swatchParent = innerFlex || element;

  // Get all swatch elements in order - both active and inactive
  const swatches = Array.from(swatchParent.querySelectorAll(':scope > [data-test-id^="radial-swatch"]'));

  // For each swatch, keep the entire swatch element as the cell content
  // (This keeps all structure and semantics, and will render as a round colored swatch)
  const columnsRow = swatches.map(swatch => swatch);

  // Build the cells array for createTable
  const cells = [
    ['Columns (columns29)'],
    columnsRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
