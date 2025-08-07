/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: Must match exactly (no variants)
  const headerRow = ['Hero (hero6)'];

  // --- 2nd row: Background image (optional) ---
  // Find the first <img> inside .sc-jTQCzO (background image container)
  let backgroundImg = null;
  const backgroundImgContainer = element.querySelector('.sc-jTQCzO');
  if (backgroundImgContainer) {
    backgroundImg = backgroundImgContainer.querySelector('img');
  }
  const backgroundRow = [backgroundImg ? backgroundImg : ''];

  // --- 3rd row: Content (headings, subheadings, paragraph, cta, foreground image, etc.) ---
  const contentCell = [];
  // Heading and subheading (in <h2>)
  const heading = element.querySelector('h2[data-test-id="section-header"]');
  if (heading) contentCell.push(heading);
  // Paragraph/description (after heading)
  const description = element.querySelector('div[data-test-id="intersection animator"] .text__TextElement-sc-qf7y4e-0');
  if (description) contentCell.push(description);
  // Foreground image and its caption (if present)
  const fgBox = element.querySelector('.box__Box-sc-1i8zs0c-0.egylQn');
  if (fgBox) {
    const fgFlex = fgBox.querySelector('.flex__Flex-sc-1r1ee79-0');
    if (fgFlex) {
      const fgImg = fgFlex.querySelector('img');
      if (fgImg) contentCell.push(fgImg);
      const fgCaption = fgFlex.querySelector('p');
      if (fgCaption) contentCell.push(fgCaption);
    }
  }

  const contentRow = [contentCell];

  // Build and replace with table
  const cells = [headerRow, backgroundRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
