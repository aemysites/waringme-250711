/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cardsNoImages57)'];
  const rows = [headerRow];

  // Find the grid containing the cards
  const grid = element.querySelector('[data-test-id="women-in-esports-rtbs-grid"]');
  if (!grid) return;

  // Get all immediate card children
  const cards = Array.from(grid.querySelectorAll(':scope > [data-test-id="rtb"]'));
  cards.forEach((card) => {
    // Find heading (h3) and content
    const heading = card.querySelector('h3');
    const contentWrapper = card.querySelector('.text__TextElement-sc-qf7y4e-0.hawAvc');

    // Compose block, using existing DOM nodes
    const cellElements = [];
    if (heading) {
      cellElements.push(heading);
    }
    if (contentWrapper) {
      // The description may be a span or div inside this wrapper
      // Copy all child nodes except the heading (which is outside)
      Array.from(contentWrapper.childNodes).forEach((n) => {
        cellElements.push(n);
      });
    }
    rows.push([cellElements]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
