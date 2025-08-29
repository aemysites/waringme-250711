/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header matches exactly
  const headerRow = ['Hero (hero11)'];

  // 2. Background image: not present in the HTML, must be an empty cell
  const backgroundRow = [''];

  // 3. Content extraction
  // Get all direct children
  const children = Array.from(element.children);
  // Headline: first <p> tag
  const headline = children.find(el => el.tagName === 'P');
  // CTA buttons: first <div> tag
  const ctaDiv = children.find(el => el.tagName === 'DIV');
  // Sub-paragraph: second <p> tag (if present)
  const allPs = children.filter(el => el.tagName === 'P');
  const subP = allPs.length > 1 ? allPs[1] : null;
  // Compose content cell (keep elements as-is, preserve semantic structure)
  const contentCell = [];
  if (headline) contentCell.push(headline);
  if (ctaDiv) contentCell.push(ctaDiv);
  if (subP) contentCell.push(subP);
  // 4. Content row
  const contentRow = [contentCell];

  // 5. Table construction, table header and structure matches example
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    backgroundRow,
    contentRow,
  ], document);

  // 6. Replace the original element with the table (no Section Metadata block needed)
  element.replaceWith(table);
}
