/* global WebImporter */
export default function parse(element, { document }) {
  // Header row with exact block name
  const headerRow = ['Hero (hero21)'];

  // Get only direct children of the element
  const children = Array.from(element.children);

  // Find the first image to be used in the image row
  const img = children.find((el) => el.tagName === 'IMG') || '';

  // Gather all heading and text content for the content row
  // For this block: Heading (h1/h2/h3), paragraphs, and CTAs if present.
  // By example, all non-image children are grouped in content cell.
  const contentElements = children.filter((el) => el !== img && (
    /^H[1-6]$/.test(el.tagName) ||
    el.tagName === 'P' ||
    el.tagName === 'A' ||
    el.tagName === 'SPAN' ||
    el.tagName === 'DIV' // Sometimes wrappers contain text/cta
  ));
  // If only one content element, pass as is. If multiple, as array.
  let contentCell = '';
  if (contentElements.length === 1) {
    contentCell = contentElements[0];
  } else if (contentElements.length > 1) {
    contentCell = contentElements;
  } else {
    contentCell = '';
  }

  // Final table: header, image (optional), content (optional)
  const cells = [
    headerRow,
    [img],
    [contentCell],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
