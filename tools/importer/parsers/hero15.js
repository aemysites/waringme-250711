/* global WebImporter */
export default function parse(element, { document }) {
  // 1. HEADER: Use the exact header as required
  const headerRow = ['Hero (hero15)'];

  // 2. IMAGE ROW: None present in this example (screenshot shows color background, but no <img>, so cell is empty)
  const imageRow = [''];

  // 3. CONTENT ROW: Compose
  // Find the main content container (the row with the text/link)
  // Only include visible, meaningful content -- omit close button
  // For content, include the call-to-action link (with text)
  // Reference the actual <a> element from the DOM, removing its SVG arrow icon for clarity
  let contentCell = '';
  // Find the <a> inside the element (it's the banner text)
  const cta = element.querySelector('a');
  if (cta) {
    // Remove SVG icon if present (it only adds an arrow, not actual content)
    const svg = cta.querySelector('svg');
    if (svg) svg.remove();
    contentCell = cta;
  }

  // 4. Compose table rows
  const cells = [
    headerRow,
    imageRow,
    [contentCell]
  ];

  // 5. Create table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}