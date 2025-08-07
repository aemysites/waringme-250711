/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: exactly as specified
  const headerRow = ['Hero (hero39)'];

  // Background image row: not present in this HTML, so empty cell
  const backgroundRow = [''];

  // Extract heading/title
  // Find the first h2 or h1 in the element (should be the prominent title)
  const heading = element.querySelector('h1, h2, h3, h4, h5, h6');

  // Extract subheading/paragraph: the subheadline is visually styled as a paragraph but is the next text block
  // Look for possible subheading/paragraph, not the heading
  let subheading = null;
  if (heading) {
    // Look for a sibling or nested paragraph after the heading
    // Try to find the next text__TextElement-sc-qf7y4e-0 after the heading
    let current = heading.parentElement;
    // Traverse down if the heading is wrapped inside multiple spans/divs
    while (current && current !== element && current.querySelector('.text__TextElement-sc-qf7y4e-0.jVKIid')) {
      current = current.querySelector('.text__TextElement-sc-qf7y4e-0.jVKIid');
      break;
    }
    if (current && current.classList && current.classList.contains('text__TextElement-sc-qf7y4e-0') && current.classList.contains('jVKIid')) {
      subheading = current;
    } else {
      // Try generic search as fallback
      subheading = element.querySelector('.text__TextElement-sc-qf7y4e-0.jVKIid');
    }
    // Make sure subheading is not the heading itself
    if (subheading === heading) subheading = null;
  } else {
    // Fallback: find first text__TextElement-sc-qf7y4e-0.jVKIid
    subheading = element.querySelector('.text__TextElement-sc-qf7y4e-0.jVKIid');
  }

  // Compose the content cell
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);

  // Table cells: header, background, content
  const cells = [headerRow, backgroundRow, [contentCell]];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
