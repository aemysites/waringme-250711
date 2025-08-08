/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example markdown
  const headerRow = ['Cards (cards59)'];
  const cards = [];

  // Find the main deals grid inside the element
  const grid = element.querySelector('[data-test-id="deals-grid"]');
  if (!grid) return;

  // Get all visible deal card elements
  const cardEls = Array.from(grid.querySelectorAll('[data-test-id^="deal-card-"]'));

  cardEls.forEach(cardEl => {
    // First cell: main card image (first .kaalGb img inside this card)
    let imageCell = null;
    const imageBox = cardEl.querySelector('.kaalGb img');
    if (imageBox) imageCell = imageBox;

    // Second cell: all textual and icon content
    const contentParts = [];

    // Optional: Highlight banner (e.g. "Most popular")
    const highlight = cardEl.querySelector('[data-test-id="deal-highlight-banner"]');
    if (highlight) contentParts.push(highlight);

    // Category: usually appears as an ul list of categories
    const dealsCats = cardEl.querySelector('[data-test-id="deals-categories"]');
    if (dealsCats) contentParts.push(dealsCats);

    // Main heading/title
    const title = cardEl.querySelector('h2');
    if (title) contentParts.push(title);

    // Icons row: sub-offers, as ul list
    const subOffers = cardEl.querySelector('[data-test-id="sub-offers"]');
    if (subOffers) contentParts.push(subOffers);

    // Optional: feature callout (e.g. orange tick row or special offer)
    const calloutList = cardEl.querySelector('ul.sc-hABBmJ');
    if (calloutList) contentParts.push(calloutList);

    // Price area, including monthly price and any price-related span
    const priceArea = cardEl.querySelector('.jNrKiN');
    if (priceArea) contentParts.push(priceArea);

    // Contract/price disclaimer, if present (not always needed if already in priceArea)
    const contractDisclaimer = cardEl.querySelector('.fOrFER');
    if (contractDisclaimer) contentParts.push(contractDisclaimer);

    // Features or promo info (e.g. ".eUsJPJ" for 'No upfront fees' etc)
    const features = cardEl.querySelector('.eUsJPJ');
    if (features) contentParts.push(features);

    // CTA button (main call to action for this card)
    const ctaBtn = cardEl.querySelector('a[data-skyui-core="Button@11.8.0"]');
    if (ctaBtn) contentParts.push(ctaBtn);

    // Card-specific disclaimer, usually follows as a sibling element with matching data-test-id
    let disclaimer = null;
    // Try to find the disclaimer in the element tree (may be sibling of grid, or right after card)
    const discId = cardEl.getAttribute('data-test-id') + '-deal-disclaimer';
    // Search first in the parent of grid (as a sibling to cards), then as a child of current card
    disclaimer = grid.querySelector(`[data-test-id="${discId}"]`) || cardEl.querySelector(`[data-test-id$="deal-disclaimer"]`);
    if (disclaimer) contentParts.push(disclaimer);

    // If no content, skip this card
    if (!imageCell && contentParts.length === 0) return;
    cards.push([imageCell, contentParts]);
  });

  // Compose the table data: header + one row per card
  const cells = [headerRow, ...cards];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
