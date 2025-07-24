/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid that contains all cards
  const container = element.querySelector('.container');
  if (!container) return;
  // The main grid is the only direct child grid of container
  let mainGrid = container.querySelector('.w-layout-grid.grid-layout');
  if (!mainGrid) return;

  // The main grid may contain <a> (main card), and nested grid with more cards
  const rootCards = [];
  Array.from(mainGrid.children).forEach((child) => {
    // Main card: <a>
    if (child.tagName === 'A') {
      rootCards.push(child);
    }
    // Nested grid: add all <a> inside
    if (child.classList.contains('w-layout-grid')) {
      rootCards.push(...child.querySelectorAll('a.utility-link-content-block'));
    }
  });

  // Helper to extract each card's image and text content (referencing source DOM)
  function extractCard(card) {
    // Image: first <img> inside card
    const img = card.querySelector('img');
    // Heading: h2, h3, or h4
    const heading = card.querySelector('h2, h3, h4');
    // Description: first <p> after heading
    let desc = null;
    if (heading) {
      // Find the next <p> sibling of heading
      let sib = heading.nextElementSibling;
      while (sib && sib.tagName !== 'P') sib = sib.nextElementSibling;
      desc = sib || null;
    }
    // CTA/Button: element with class 'button', but only if not just a visual button
    let cta = null;
    const button = card.querySelector('.button');
    if (button && button.textContent.trim()) cta = button;

    // Build content cell (reference source elements)
    const cellContent = [];
    if (heading) cellContent.push(heading);
    if (desc) cellContent.push(desc);
    if (cta) cellContent.push(cta);

    return [img, cellContent];
  }

  // Prepare table rows: header, then 1 row per card
  const rows = [['Cards (cards36)']];
  rootCards.forEach(card => {
    const [img, textContent] = extractCard(card);
    // Only push card if at least image and text are present
    if (img && textContent.length) {
      rows.push([img, textContent]);
    }
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
