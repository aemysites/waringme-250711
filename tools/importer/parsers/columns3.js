/* global WebImporter */
export default function parse(element, { document }) {
  // Find the flex container that holds the columns
  // Path: section > div > div (single-image-block) > div.flex__Flex-sc-1r1ee79-0.XoyIg
  const rootFlex = element.querySelector('div > div > div.flex__Flex-sc-1r1ee79-0.XoyIg');
  if (!rootFlex) return;

  // The main content container with two columns: image and content
  const contentFlex = rootFlex.querySelector('[data-test-id="single-image-block-content"]');
  if (!contentFlex) return;
  // Should have two children: left (image), right (content)
  const columns = contentFlex.querySelectorAll(':scope > div');
  if (columns.length < 2) return;

  // Left column: contains the main image (referencing the element directly)
  const leftCol = columns[0];
  const img = leftCol.querySelector('img');
  // If no image, use a placeholder node to avoid empty cell
  const leftCell = img ? img : document.createTextNode('');

  // Right column: contains heading, text, link, and app badges
  const rightCol = columns[1];
  // Use a fragment to collect all relevant content, preserving their order and structure
  const col2Content = [];

  // Heading (h2)
  const heading = rightCol.querySelector('h2');
  if (heading) col2Content.push(heading);

  // Description text (span inside .text__TextElement-sc-qf7y4e-0)
  // This is inside a div with class box__Box-sc-1i8zs0c-0 hxPhwb
  const description = rightCol.querySelector('div.box__Box-sc-1i8zs0c-0.hxPhwb span');
  if (description) col2Content.push(description);

  // Learn More link (a[data-test-id="section-cta-link"])
  const learnLink = rightCol.querySelector('a[data-test-id="section-cta-link"]');
  if (learnLink) col2Content.push(learnLink);

  // App Store badges: two links (<a>) each with <img> inside .hkJlOb
  const badgeRow = rightCol.querySelector('.flex__Flex-sc-1r1ee79-0.hkJlOb');
  if (badgeRow) col2Content.push(badgeRow);

  // Build the columns3 block table
  // Header must match: 'Columns (columns3)'
  const cells = [
    ['Columns (columns3)'],
    [leftCell, col2Content]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
