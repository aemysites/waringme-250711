/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards grid
  const grid = element.querySelector('[data-test-id="deals-grid"]');
  if (!grid) return;
  // Find all direct children that are deal cards
  const cards = Array.from(grid.querySelectorAll(':scope > [data-test-id^="deal-card-"]'));

  // Table header row as in the example
  const cells = [['Cards (cards33)']];

  cards.forEach(card => {
    // ----------- IMAGE CELL -------------
    // Get main card image
    const mainImgWrapper = card.querySelector('.sc-blmEgr');
    let mainImg = mainImgWrapper ? mainImgWrapper.querySelector('img') : null;

    // Get offer icons (inside sub-offers)
    let offerIcons = [];
    const offerList = card.querySelector('[data-test-id="sub-offers"] ul');
    if (offerList) {
      offerIcons = Array.from(offerList.querySelectorAll('img'));
    }
    // Compose image cell
    let imageCell = [];
    if (mainImg) imageCell.push(mainImg);
    if (offerIcons.length) {
      const iconsDiv = document.createElement('div');
      offerIcons.forEach(icon => iconsDiv.appendChild(icon));
      imageCell.push(iconsDiv);
    }
    if (!imageCell.length) imageCell = [''];

    // ----------- TEXT CELL --------------
    const textCell = document.createElement('div');
    // Banner (Most popular)
    const banner = card.querySelector('[data-test-id="deal-highlight-banner"]');
    if (banner) textCell.appendChild(banner);
    // Categories
    const categories = card.querySelector('[data-test-id="deals-categories"]');
    if (categories) textCell.appendChild(categories);
    // Title
    const title = card.querySelector('h2');
    if (title) textCell.appendChild(title);
    // Callout (special label, eg. Our lowest price is back)
    const calloutList = card.querySelector('ul.sc-qZrbh');
    if (calloutList) textCell.appendChild(calloutList);
    // Pricing box
    const price = card.querySelector('[data-test-id="price"]');
    if (price) textCell.appendChild(price);
    // No upfront fees + special ticks
    const labelsFlex = card.querySelector('.flex__Flex-sc-1r1ee79-0.eUsJPJ');
    if (labelsFlex) textCell.appendChild(labelsFlex);
    // Deal card callout (extra info below price)
    const dealCardCallout = card.querySelector('[data-test-id="deal-card-callout"]');
    if (dealCardCallout) textCell.appendChild(dealCardCallout);
    // CTA button
    const cta = card.querySelector('a.button__Button-sc-1m4qkvf-0');
    if (cta) textCell.appendChild(cta);
    // Disclaimer at the bottom
    const disclaimer = card.querySelector('[data-test-id$="deal-disclaimer"]');
    if (disclaimer) textCell.appendChild(disclaimer);
    cells.push([imageCell, textCell]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}