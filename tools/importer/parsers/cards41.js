/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background-image URL from a div
  function getBgImageUrl(div) {
    if (!div) return null;
    // Try computedStyle first
    let url = '';
    if (window.getComputedStyle) {
      const style = window.getComputedStyle(div);
      const bg = style && style.getPropertyValue('background-image');
      if (bg) {
        const match = bg.match(/url\(["']?(.*?)["']?\)/i);
        if (match) url = match[1];
      }
    }
    // Fallback to inline style
    if (!url && div.style && div.style.backgroundImage) {
      const match = div.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/i);
      if (match) url = match[1];
    }
    return url || null;
  }

  // Find all cards
  const cards = Array.from(element.querySelectorAll('[data-test-id^="product-card-"]'));

  // Header row exactly as in the example
  const rows = [['Cards (cards41)']];

  cards.forEach(card => {
    // Image: find background-image div and use as <img>
    const bgDiv = card.querySelector('[data-test-id="background-image"]');
    let imgEl = '';
    const imgUrl = getBgImageUrl(bgDiv);
    if (imgUrl) {
      imgEl = document.createElement('img');
      imgEl.src = imgUrl;
      imgEl.alt = '';
    }

    // Text cell: may contain heading, description, CTA
    const textCell = [];
    // Heading: h3[data-test-id=section-header]
    const heading = card.querySelector('h3[data-test-id="section-header"]');
    if (heading) {
      // Use referenced heading and its children (spans for overline/title)
      textCell.push(heading);
    }
    // Description
    const description = card.querySelector('[data-skyui-core="Markdown@11.8.0"]');
    if (description && description.textContent.trim()) {
      // Wrap in a <p> if not already a <p> or block
      let p = document.createElement('p');
      p.textContent = description.textContent.trim();
      textCell.push(p);
    }
    // CTA button (first <a> inside the card)
    const cta = card.querySelector('a[data-skyui-core^="Button"]');
    if (cta) {
      textCell.push(cta);
    }

    rows.push([
      imgEl,
      textCell.length > 1 ? textCell : (textCell[0] || '')
    ]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
