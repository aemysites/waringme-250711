/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row matches example exactly
  const headerRow = ['Hero (hero58)'];

  // 2. Second row: background image (none in this HTML, so cell is empty string)
  const backgroundImageRow = [''];

  // 3. Third row: Title, subheading, CTA
  // Collect content in natural order from the HTML
  const contentCell = [];

  // Find heading (h1)
  const heading = element.querySelector('h1');
  if (heading) contentCell.push(heading);

  // Find subheading (the description paragraph under the heading)
  // Looks for the 'span[data-skyui-core="Markdown@11.8.0"]' inside the structure
  const paragraph = element.querySelector('span[data-skyui-core="Markdown@11.8.0"]');
  if (paragraph) contentCell.push(paragraph);

  // Find CTA button (anchor)
  const cta = element.querySelector('a[data-test-id="stream-hero-cta"]');
  if (cta) contentCell.push(cta);

  // Compose the rows for the block table
  const rows = [
    headerRow,
    backgroundImageRow,
    [contentCell],
  ];

  // Create and replace as requested, using existing elements, no markdown or clones
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
