/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the table, exact as per requirements
  const headerRow = ['Columns (columns17)'];

  // Find grid container: the immediate container for columns
  // It's the .grid__Grid-sc-ysk8de-0 element
  const grid = element.querySelector('.grid__Grid-sc-ysk8de-0');
  if (!grid) return;

  // Two main columns: left (content) and right (image)
  // Find the left column: .box__Box-sc-1i8zs0c-0.hFTtFW
  const leftColContainer = grid.querySelector('.box__Box-sc-1i8zs0c-0.hFTtFW');
  // Find the right column: the only <img> under grid
  const rightImg = grid.querySelector('img');

  // Collect left column content in order: h2, markdown, ctas
  const leftContent = [];
  if (leftColContainer) {
    // Heading h2 (How to watch)
    const h2 = leftColContainer.querySelector('h2');
    if (h2) leftContent.push(h2);
    // The markdown block (Sky Glass, Sky Stream, Sky Q sections)
    const markdown = leftColContainer.querySelector('[data-skyui-core="Markdown@11.7.1"]');
    if (markdown) leftContent.push(markdown);
    // CTA buttons container
    const ctaContainer = leftColContainer.querySelector('[data-test-id="show.how-to-watch.ctas"]');
    if (ctaContainer) {
      // Add all children (buttons) of the CTA container
      Array.from(ctaContainer.children).forEach(child => leftContent.push(child));
    }
  }

  // Right content is just the image
  const rightContent = rightImg ? [rightImg] : [];

  // Compose the cells array to match 2 columns
  const cells = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create and replace with the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
