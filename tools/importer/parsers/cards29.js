/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must match the example exactly
  const headerRow = ['Cards (cards29)'];
  const cells = [headerRow];

  // Find the grid container for cards
  const grid = element.querySelector('[data-test-id="play-like-a-pro-rtbs-grid"]');
  const cards = grid ? Array.from(grid.children) : [];

  cards.forEach(card => {
    // First cell: If video present, represent as a link to its src
    let visual = '';
    const video = card.querySelector('video');
    if (video && video.src) {
      const link = document.createElement('a');
      link.href = video.src;
      link.textContent = video.src;
      visual = link;
    }

    // Second cell: Collect all relevant text content
    // Title (h3)
    const title = card.querySelector('h3');
    // All text blocks (divs with text__TextElement-sc-qf7y4e-0)
    const textBlocks = Array.from(card.querySelectorAll('div.text__TextElement-sc-qf7y4e-0'));
    // Compose cell content: heading first, then all description blocks
    const cellContent = [];
    if (title) cellContent.push(title);
    textBlocks.forEach(block => {
      // Only add block if not already included (avoid duplicate title)
      if (block !== title) {
        cellContent.push(block);
      }
    });
    // If no title or description, add empty string to keep cell non-empty
    if (cellContent.length === 0) cellContent.push('');
    cells.push([visual, cellContent]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
