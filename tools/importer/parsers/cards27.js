/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per example, exactly as 'Cards (cards27)'
  const headerRow = ['Cards (cards27)'];
  const rows = [];
  // Find the UL containing the card LIs
  const ul = element.querySelector('ul');
  if (!ul) return;
  const lis = Array.from(ul.children);
  lis.forEach((li) => {
    // Get the image for the left cell
    const img = li.querySelector('img');
    // Get the right cell (text content)
    // We reference the content block containing all text, price, ctas, etc.
    const card = li.querySelector('[data-skyui-core^="Card"]');
    let rightCellContent = [];
    if (card) {
      // Get card's main content area
      const mainContent = card.querySelector('[data-test-id^="speed-card-"]');
      if (mainContent) {
        // Title: .VUMTE or fallback to a first strong span
        const title = mainContent.querySelector('.VUMTE');
        if (title) {
          const strong = document.createElement('strong');
          strong.textContent = title.textContent.trim();
          rightCellContent.push(strong);
        }
        // Description: .hXhQsq (if present)
        const description = mainContent.querySelector('.hXhQsq');
        if (description) {
          rightCellContent.push(document.createElement('br'));
          rightCellContent.push(description);
        }
        // Speed: .hmEdyt box
        const speedBox = mainContent.querySelector('.hmEdyt');
        if (speedBox) {
          rightCellContent.push(document.createElement('br'));
          // '67 Mbps avg. speed' is a sequence of spans in this box
          // Instead of flattening, just reference the whole speedBox
          rightCellContent.push(speedBox);
        }
        // Features: .haivtr box (links like 'What is Full Fibre?', 'hub', etc.)
        const featuresBox = mainContent.querySelector('.haivtr');
        if (featuresBox) {
          rightCellContent.push(document.createElement('br'));
          rightCellContent.push(featuresBox);
        }
        // Price: last .ePJRTi (contains £/month, price info)
        let priceBoxes = mainContent.querySelectorAll('.box__Box-sc-1i8zs0c-0.ePJRTi');
        // The last .ePJRTi is always the price area (not feature links)
        if (priceBoxes.length > 0) {
          const price = priceBoxes[priceBoxes.length - 1];
          rightCellContent.push(document.createElement('br'));
          rightCellContent.push(price);
        }
        // CTA: a[data-test-id^=cta-speed-card-]
        const cta = mainContent.querySelector('a[data-test-id^="cta-speed-card-"]');
        if (cta) {
          rightCellContent.push(document.createElement('br'));
          rightCellContent.push(cta);
        }
      }
    }
    // Use null if no image, or right cell (to preserve cell count for createTable)
    rows.push([img, rightCellContent.length ? rightCellContent : '']);
  });
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
