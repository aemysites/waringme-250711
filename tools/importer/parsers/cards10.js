/* global WebImporter */
export default function parse(element, { document }) {
  // Block header must match example EXACTLY
  const headerRow = ['Cards (cards10)'];
  // Find the card grid
  const grid = element.querySelector('[data-test-id="play-like-a-pro-rtbs-grid"]');
  if (!grid) return;
  // Find all card/listitem elements
  const cards = Array.from(grid.querySelectorAll('[data-test-id="rtb"]'));
  const rows = cards.map(card => {
    // First cell: video as link (per requirements for non-image src elements)
    let mediaCell = '';
    const video = card.querySelector('video[src]');
    if (video) {
      const link = document.createElement('a');
      link.href = video.src;
      link.textContent = video.src;
      mediaCell = link;
    }

    // Second cell: all text content (title + description)
    // Reference the original elements directly (do not clone)
    const title = card.querySelector('h3');
    const descriptionContainer = card.querySelector('div.text__TextElement-sc-qf7y4e-0.hawAvc');
    // If for some reason not found, fallback to any div or span inside card
    const textContent = [];
    if (title) textContent.push(title);
    if (descriptionContainer) {
      textContent.push(descriptionContainer);
    } else {
      // Fallback: find any span or div that has text
      const fallback = Array.from(card.querySelectorAll('div,span')).find(
        el => el !== title && el.textContent.trim().length > 0
      );
      if (fallback) textContent.push(fallback);
    }
    return [mediaCell, textContent];
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
