/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion wrapper (the main block)
  const accordionWrapper = element.querySelector('[data-skyui-core^="Accordion"]');
  if (!accordionWrapper) return;

  // Get the title text from the button (this is the clickable header)
  let headingText = '';
  const headingButton = accordionWrapper.querySelector('h2 button');
  if (headingButton) {
    // Try to get the span with the text, fallback to button text
    const headingSpan = headingButton.querySelector('span span');
    headingText = headingSpan ? headingSpan.textContent.trim() : headingButton.textContent.trim();
  }

  // Get the content of the accordion
  let contentCell = '';
  const contentWrapper = accordionWrapper.querySelector('.content__Wrapper-sc-m4v15p-1');
  if (contentWrapper) {
    // The content is deeply nested; grab the deepest content box
    // We'll use the element reference for robust extraction
    const contentInner = contentWrapper.querySelector('.content__Inner-sc-m4v15p-0');
    if (contentInner) {
      contentCell = contentInner;
    }
  }
  // If for some reason the expected content structure is missing, do not break - just use empty

  // Compose the block table as per the block guidelines: header and one row (2 columns)
  const cells = [
    ['Accordion (accordion8)'],
    [headingText, contentCell]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
