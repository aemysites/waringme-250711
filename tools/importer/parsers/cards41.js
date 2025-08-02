/* global WebImporter */
export default function parse(element, { document }) {
  // Build the header row exactly as in the example
  const headerRow = ['Cards (cards41)'];
  const cells = [headerRow];

  // Find all product cards within the element
  const cardSelector = '[data-test-id^="product-card-"]';
  const productCards = element.querySelectorAll(cardSelector);

  productCards.forEach(card => {
    // --- IMAGE/COVER ---
    // Use the background-image div as the card image cell
    let imageCell = card.querySelector('[data-test-id="background-image"]');

    // --- CONTENT ---
    // Find the content container within the card
    const contentDiv = card.querySelector('.sc-faxByu');
    const contentCellParts = [];

    if (contentDiv) {
      // Find and append the heading(s)
      const h3 = contentDiv.querySelector('h3');
      if (h3) {
        // Overline (if present)
        const overSpan = h3.querySelector('[data-test-id="overline-text"]');
        if (overSpan) {
          const overDiv = document.createElement('div');
          overDiv.appendChild(overSpan);
          contentCellParts.push(overDiv);
        }
        // Main title (largest span, typically last)
        const titleSpan = h3.querySelector('span:last-child');
        if (titleSpan) {
          const strong = document.createElement('strong');
          strong.appendChild(titleSpan);
          contentCellParts.push(strong);
        }
      }
      // Description
      const descSpan = contentDiv.querySelector('span[data-skyui-core^="Markdown"]');
      if (descSpan) {
        const p = document.createElement('p');
        p.appendChild(descSpan);
        contentCellParts.push(p);
      }
      // CTA button
      const ctaBtn = contentDiv.querySelector('a[data-skyui-core^="Button"]');
      if (ctaBtn) {
        contentCellParts.push(document.createElement('br'));
        contentCellParts.push(ctaBtn);
      }
    }
    // If nothing found for content, fallback to card
    let contentCell;
    if (contentCellParts.length > 0) {
      contentCell = contentCellParts;
    } else {
      contentCell = contentDiv || card;
    }
    // Push row to table
    cells.push([imageCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
