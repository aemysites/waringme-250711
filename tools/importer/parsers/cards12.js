/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header
  const headerRow = ['Cards (cards12)'];
  const rows = [headerRow];

  // Select all direct child divs, which may be cards or images
  const cards = Array.from(element.querySelectorAll(':scope > div'));

  cards.forEach((cardDiv) => {
    // Card image: pick first img in this cardDiv
    const img = cardDiv.querySelector('img');
    if (!img) return; // Skip if no image

    // Card text block: look for text in nested divs with h3 (title) and p (desc)
    let textCell = '';
    let textWrapper = null;
    // Look for the innermost utility-padding-all-2rem div
    const contentDiv = cardDiv.querySelector('.utility-padding-all-2rem');
    if (contentDiv) {
      // Reference the actual heading and paragraph elements if present
      const nodes = [];
      const heading = contentDiv.querySelector('h3, h2, h4, h5, h6');
      if (heading) nodes.push(heading);
      const para = contentDiv.querySelector('p');
      if (para) nodes.push(para);
      if (nodes.length > 0) {
        // If both or either exist, combine them in a fragment
        textCell = nodes;
      }
    }
    rows.push([img, textCell]);
  });

  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
