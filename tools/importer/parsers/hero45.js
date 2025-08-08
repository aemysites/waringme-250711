/* global WebImporter */
export default function parse(element, { document }) {
  // --- 1. Table header row: block name exactly as in spec ---
  const headerRow = ['Hero (hero45)'];

  // --- 2. Second row: background image (empty if none) ---
  // For this provided HTML, there is NO background image element. If ever present, should be image element.
  const backgroundRow = [''];

  // --- 3. Third row: content (title, subheading, cta) ---
  // Reference existing elements, maintain heading and markup structure.
  // We want all main content as a single cell. That means:
  // - The main heading <h1>
  // - The two subheading lines (pricing and subtext)
  // - The CTA button ('Buy now')
  // We'll collect them in order as children.

  const contentBlocks = [];
  // 1. Find <h1> (main headline)
  const h1 = element.querySelector('h1');
  if (h1) contentBlocks.push(h1);

  // 2. Find the subblock with the pricing and supporting text
  // This is the text__TextElement-sc-qf7y4e-0.UByi
  const priceSubheading = element.querySelector('.text__TextElement-sc-qf7y4e-0.UByi');
  if (priceSubheading) contentBlocks.push(priceSubheading);

  // 3. Find the CTA anchor (button)
  const cta = element.querySelector('a[data-test-id^="hero-cta-"]');
  if (cta) contentBlocks.push(cta);

  // Note: All content is referenced directly as existing elements.

  const contentRow = [contentBlocks];

  // Compose the new block table
  const cells = [
    headerRow,
    backgroundRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);

  // --- Replace old element with new block table ---
  element.replaceWith(table);
  // Finished. No Section Metadata table as none in example.
}
