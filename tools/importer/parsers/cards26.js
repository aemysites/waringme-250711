/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: extract the card's main image or visual
  function getCardImage(card) {
    const bgDiv = card.querySelector('[data-test-id="background-image"]');
    if (bgDiv) {
      // Try background image via style attribute
      const bgImage = bgDiv.style.backgroundImage;
      if (bgImage && bgImage.startsWith('url(')) {
        const m = bgImage.match(/url\(["']?(.*?)["']?\)/);
        if (m && m[1]) {
          const img = document.createElement('img');
          img.src = m[1];
          img.alt = '';
          return img;
        }
      }
      // If no background image in style, check if there's an <img> inside
      const img = bgDiv.querySelector('img');
      if (img) return img;
      // Otherwise, fallback to using the div itself (may provide branding/color)
      return bgDiv;
    }
    return '';
  }

  // Helper: extract the card's content (header, description, ctas)
  function getCardContent(card) {
    const content = [];
    // Get heading (h3 with spans inside)
    const header = card.querySelector('h3[data-test-id="section-header"]');
    if (header) content.push(header);
    // Get description: it's either a span[data-skyui-core="Markdown@11.8.0"] or div[data-skyui-core="Markdown@11.8.0"] (sometimes for <br> markup)
    let desc = card.querySelector('[data-skyui-core="Text@11.8.0"] span[data-skyui-core="Markdown@11.8.0"]');
    if (!desc)
      desc = card.querySelector('[data-skyui-core="Text@11.8.0"] div[data-skyui-core="Markdown@11.8.0"]');
    if (desc) content.push(desc);
    // Get CTAs (can be 0, 1, or 2); always <a> tags within [data-test-id*="cta"]
    const ctaWrap = card.querySelector('[data-test-id*="cta"]');
    if (ctaWrap) {
      const ctas = Array.from(ctaWrap.querySelectorAll('a'));
      if (ctas.length) {
        const p = document.createElement('p');
        ctas.forEach((cta, idx) => {
          p.appendChild(cta);
          if (idx < ctas.length - 1) p.appendChild(document.createTextNode(' '));
        });
        content.push(p);
      }
    }
    return content;
  }

  // Find the grid of cards
  const grid = element.querySelector('[data-skyui-core="Grid@11.8.0"]');
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('[data-test-id^="product-card-"]'));

  // Build the table rows: first row is header, then 1-per-card rows
  const rows = [['Cards (cards26)']];
  cards.forEach(card => {
    const img = getCardImage(card);
    const content = getCardContent(card);
    rows.push([img, content]);
  });

  // Replace the element with the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
