/* global WebImporter */
export default function parse(element, { document }) {
  // Create table header row exactly as required
  const headerRow = ['Cards (cards9)'];
  const rows = [headerRow];

  // Find all card container divs (direct children with data-test-id)
  const cardDivs = Array.from(element.querySelectorAll(':scope > [data-test-id^="feature-tiles-card-"]'));

  cardDivs.forEach(card => {
    // Get image (img element, if any)
    const img = card.querySelector('img');

    // Get the card title (first p direct descendant inside card, typically a heading)
    // and description (any other p inside card)
    let title = null;
    let description = null;
    // Sometimes layout may differ, so allow for multiple ps
    const ps = Array.from(card.querySelectorAll('p'));
    if (ps.length > 0) {
      title = ps[0];
      // If more than 1, treat the rest as description
      if (ps.length > 1) {
        // If there are >2, combine them in order (as multiple paragraphs)
        description = ps.slice(1);
      }
    }

    // Compose text cell contents, preserving element references
    let textCell = [];
    if (title) textCell.push(title);
    if (description) textCell = textCell.concat(description);

    // If no title/desc found, fallback to text contents of all child nodes
    if (!title && !description) {
      // As a last resort, grab all text nodes in card
      const txt = card.textContent.trim();
      if (txt) textCell.push(txt);
    }
    rows.push([
      img,
      textCell
    ]);
  });

  // Build the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
