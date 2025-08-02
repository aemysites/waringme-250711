/* global WebImporter */
export default function parse(element, { document }) {
  // Find the top-level columns (should be two direct children)
  const columns = element.querySelectorAll(':scope > div');
  if (columns.length !== 2) {
    // Not the expected structure, do not parse
    return;
  }

  // LEFT COLUMN: Should contain the main image
  let leftCell = null;
  const mainImageDiv = columns[0].querySelector('[data-test-id="upsell-main-image"]');
  if (mainImageDiv) {
    const mainImg = mainImageDiv.querySelector('img');
    if (mainImg) leftCell = mainImg;
  }
  // Fallback: first img in left column
  if (!leftCell) {
    const fallbackImg = columns[0].querySelector('img');
    if (fallbackImg) leftCell = fallbackImg;
  }

  // RIGHT COLUMN: Should contain all content
  const rightCol = columns[1];
  const rightCellParts = [];

  // Upsell Logos (ul > li > img)
  const logos = rightCol.querySelector('ul[data-test-id="upsell-logos"]');
  if (logos) rightCellParts.push(logos);

  // Heading and description
  const heading = rightCol.querySelector('h3');
  if (heading) rightCellParts.push(heading);
  const desc = rightCol.querySelector('p');
  if (desc) rightCellParts.push(desc);

  // "Learn more" link
  const learnMore = rightCol.querySelector('a[href*="glass/air"]');
  if (learnMore) rightCellParts.push(learnMore);

  // Pricing container (contains both visible and visually hidden price)
  const priceDiv = rightCol.querySelector('[data-skyui-core*="Price"]');
  if (priceDiv) rightCellParts.push(priceDiv);

  // CTA Button (Buy now)
  const ctaButton = rightCol.querySelector('a[data-test-id="upsell-cta-button"]');
  if (ctaButton) rightCellParts.push(ctaButton);

  // If for some reason there are no parts, just include the right column
  let rightCell = rightCellParts.length ? rightCellParts : [rightCol];

  // Compose the table as per block requirements
  const cells = [
    ['Columns (columns22)'],
    [leftCell, rightCell]
  ];

  // Create and replace with the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
