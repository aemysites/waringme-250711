/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate children of the element
  const children = Array.from(element.querySelectorAll(':scope > *'));

  // Find background image if present (first <img> among children)
  const backgroundImg = children.find(el => el.tagName === 'IMG');

  // Collect all headings (h1-h6) and paragraphs (or similar) for the content cell
  // For this variation, headline is present as h1; subheading/CTA are optional (not present in this HTML)
  const contentElements = [];
  children.forEach(el => {
    if (/^H[1-6]$/.test(el.tagName)) {
      contentElements.push(el);
    }
    // Any future handling for subheading or CTA buttons can be added here
  });

  // Compose the table rows as per block spec (1 column, 3 rows)
  const headerRow = ['Hero (hero28)'];
  const imageRow = [backgroundImg ? backgroundImg : ''];
  const contentRow = [contentElements.length ? contentElements : ''];

  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
