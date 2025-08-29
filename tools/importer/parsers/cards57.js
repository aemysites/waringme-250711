/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards57)'];
  const rows = [headerRow];
  // Find all cards (li.item__Element-sc-w6guis-0)
  const cards = element.querySelectorAll('ul.items__Element-sc-behb7x-0 > li.item__Element-sc-w6guis-0');
  cards.forEach(card => {
    // -------- Image cell --------
    let image = null;
    const imageDiv = card.querySelector('.sc-dmXWDj');
    if (imageDiv) {
      const img = imageDiv.querySelector('img');
      if (img) image = img;
    }
    // -------- Text cell --------
    const textCellContent = [];
    // 1. Banner/top label (e.g. 'Most popular')
    const topBanner = card.querySelector('[data-test-id="deal-highlight-banner"]');
    if (topBanner) textCellContent.push(topBanner);
    // 2. Super-category (e.g. TV & Broadband, Broadband)
    const dealsCategories = card.querySelector('[data-test-id="deals-categories"]');
    if (dealsCategories) textCellContent.push(dealsCategories);
    // 3. Title
    const title = card.querySelector('.PJhVs h2');
    if (title) textCellContent.push(title);
    // 4. Sub-offers/feature icons
    const subOffers = card.querySelector('[data-test-id="sub-offers"] ul');
    if (subOffers) textCellContent.push(subOffers);
    // 5. Callouts (orange banners, etc)
    // 5a. Lowest price is back etc. (ul.sc-csKJxZ)
    const lowestPrice = card.querySelector('ul.sc-csKJxZ');
    if (lowestPrice) textCellContent.push(lowestPrice);
    // 5b. Callout bar below price (data-test-id="deal-card-callout")
    const dealCallout = card.querySelector('[data-test-id="deal-card-callout"]');
    if (dealCallout) textCellContent.push(dealCallout);
    // 6. Price block (data-test-id="price")
    const priceBlock = card.querySelector('[data-test-id="price"]');
    if (priceBlock) textCellContent.push(priceBlock);
    // 7. Additional labels under price, e.g. no upfront fees, tick, get extra channels
    const afterPrice = card.querySelectorAll('.eUsJPJ');
    afterPrice.forEach(label => textCellContent.push(label));
    // 8. CTA Button (Get Started)
    const cta = card.querySelector('a.button__Button-sc-1m4qkvf-0');
    if (cta) textCellContent.push(cta);
    // 9. Disclaimer (at bottom)
    const disclaimer = card.querySelector('[data-test-id$="deal-disclaimer"]');
    if (disclaimer) textCellContent.push(disclaimer);
    // Add row
    rows.push([image, textCellContent]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
