/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Hero (hero44)'];

  // No background image in the provided HTML, so leave this cell empty
  const bgRow = [''];

  // Content row: collect all visible heading/subheading/cta from the provided HTML.
  // The structure: there's a wrapping flex/box/flex/h2/span
  // The meaningful content is the h2 (with a span) -> the heading
  // We want to keep the heading as is, preserving semantics and colorful span.
  // If there were more content after the heading, we'd want to include it, but here it's just the h2.

  // Find the first heading within the element
  const heading = element.querySelector('h1, h2, h3');
  let contentCell;
  if (heading) {
    contentCell = heading;
  } else {
    // fallback: use all content in the block
    contentCell = element;
  }

  const contentRow = [contentCell];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgRow,
    contentRow
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
