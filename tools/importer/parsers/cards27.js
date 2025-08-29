/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per example
  const headerRow = ['Cards (cards27)'];
  const rows = [];

  // Cards are contained in .sc-gHGmpV > [data-skyui-core="Card@11.8.0"]
  // Banners (Add WiFi Max) are in [data-test-id="speedcard-highlight-banner"]
  // Each wrapper can have a banner and/or a card
  const wrappers = Array.from(element.querySelectorAll(':scope > div'));
  wrappers.forEach(wrapper => {
    // Banner handling (always before card in markup)
    const banners = wrapper.querySelectorAll('[data-test-id="speedcard-highlight-banner"]');
    banners.forEach(banner => {
      // Banner row: empty image cell, banner block cell
      rows.push(['', banner]);
    });
    // Card handling
    const card = wrapper.querySelector('[data-skyui-core="Card@11.8.0"]');
    if (card) {
      // Find image (mandatory)
      const img = card.querySelector('img');
      // Find the block with all info, which is the div[data-test-id^="speed-card-"] (if present), else use the card
      let infoBlock = card.querySelector('[data-test-id^="speed-card-"]');
      if (!infoBlock) infoBlock = card;
      rows.push([img, infoBlock]);
    }
  });

  // Compose table: header, then rows
  const tableArray = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(tableArray, document);
  // Replace element
  element.replaceWith(block);
}
