/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Hero (hero53)'];

  // Second row (background image) - none present in this HTML
  const backgroundRow = [''];

  // --- Main Content Extraction ---
  // Title: find the first <h1> under the element
  const h1 = element.querySelector('h1');

  // Subheading/Price and Disclaimer: look for text__TextElement that contains price and disclaimer
  let price, disclaimer;
  const textBlocks = element.querySelectorAll('.text__TextElement-sc-qf7y4e-0.UByi');
  if (textBlocks.length > 0) {
    // This block usually contains two spans (price & disclaimer)
    const spans = textBlocks[0].querySelectorAll('span');
    if (spans.length > 0) {
      price = spans[0];
      if (spans.length > 1) {
        disclaimer = spans[1];
      }
    }
  }

  // CTA: find the first anchor with role button, or known class
  let cta;
  const ctaContainer = element.querySelector('[data-test-id="hero-cta"]');
  if (ctaContainer) {
    cta = ctaContainer.querySelector('a');
  } else {
    cta = element.querySelector('a.button__Button-sc-1m4qkvf-0');
  }

  // Build the content elements array in order, referencing real elements
  const contentCell = [];
  if (h1) contentCell.push(h1);
  if (price) {
    contentCell.push(document.createElement('br'));
    contentCell.push(price);
  }
  if (disclaimer) {
    contentCell.push(document.createElement('br'));
    contentCell.push(disclaimer);
  }
  if (cta) {
    contentCell.push(document.createElement('br'));
    contentCell.push(cta);
  }

  // The content cell for the third row
  const contentRow = [contentCell.length === 1 ? contentCell[0] : contentCell];

  // Compose the table as a 1-column, 3-row table as per the example
  const cells = [headerRow, backgroundRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
