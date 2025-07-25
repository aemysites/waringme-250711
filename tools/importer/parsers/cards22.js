/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the header row
  const headerRow = ['Cards (cards22)'];
  const rows = [headerRow];

  // Select all tab panes (each tab has a set of cards)
  const tabPanes = element.querySelectorAll(':scope > div');

  tabPanes.forEach((tabPane) => {
    // In each tab, find the grid of cards
    const grid = tabPane.querySelector('.w-layout-grid');
    if (!grid) return;
    // Each card is an anchor <a> in the grid
    const cards = grid.querySelectorAll(':scope > a');
    cards.forEach((card) => {
      // First cell: image (if available)
      let imageCell = '';
      const aspectDiv = card.querySelector('.utility-aspect-3x2');
      if (aspectDiv) {
        const img = aspectDiv.querySelector('img');
        if (img) imageCell = img;
      }
      // Second cell: text content (heading + description)
      // Get the first h3 or .h4-heading inside card
      const heading = card.querySelector('h3, .h4-heading');
      // Get the first .paragraph-sm inside card (excluding those within .utility-aspect-3x2)
      let desc = null;
      const descCandidates = Array.from(card.querySelectorAll('.paragraph-sm'));
      desc = descCandidates.find(d => !aspectDiv || !aspectDiv.contains(d)) || null;
      const cellContents = [];
      if (heading) cellContents.push(heading);
      if (desc) cellContents.push(desc);
      rows.push([imageCell, cellContents]);
    });
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
