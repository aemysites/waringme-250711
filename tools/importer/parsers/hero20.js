/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Hero (hero20)'];

  // Background image row (empty in this HTML)
  const backgroundRow = [''];

  // Content row: combine logo and hero details if present.
  let logoContent = null;
  let heroDetailsContent = null;

  // Get all immediate children
  const children = element.querySelectorAll(':scope > div');
  for (const child of children) {
    const logoWrapper = child.querySelector('.hero-logo-channel-wrapper');
    if (logoWrapper && !logoContent) {
      logoContent = logoWrapper;
    }
    const heroDetails = child.querySelector('.hero-details');
    if (heroDetails && !heroDetailsContent) {
      // Only include details if it is not empty (ignoring whitespace-only or empty divs)
      const meaningful = Array.from(heroDetails.childNodes).some(
        n => (n.nodeType === 1 && (n.textContent && n.textContent.trim().length > 0)) || (n.nodeType === 3 && n.textContent.trim().length > 0)
      );
      if (meaningful) {
        heroDetailsContent = heroDetails;
      }
    }
  }

  // Compose content cell: combine logo and hero details (if any)
  const cellContent = [];
  if (logoContent) cellContent.push(logoContent);
  if (heroDetailsContent) cellContent.push(heroDetailsContent);

  // If the combination is empty, use empty string; else, use array
  const contentRow = [cellContent.length === 0 ? '' : cellContent];

  const cells = [headerRow, backgroundRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
