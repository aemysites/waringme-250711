/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the accordion wrapper
  const accordion = element.querySelector('[data-skyui-core^="Accordion@"]');
  if (!accordion) return;

  // Get the title/button text from the accordion header
  let titleText = '';
  const headerBtn = accordion.querySelector('h2 button');
  if (headerBtn) {
    // Prefer the innermost span, fallback to button textContent
    const spanSpan = headerBtn.querySelector('span span');
    if (spanSpan && spanSpan.textContent.trim()) {
      titleText = spanSpan.textContent.trim();
    } else {
      titleText = headerBtn.textContent.trim();
    }
  }

  // Get the content node for the accordion section
  // Use the content region (role=region) -> box with data-test-id=legals-accordion-content
  let contentCell = '';
  const contentRegion = accordion.querySelector('[role="region"]');
  if (contentRegion) {
    const contentBox = contentRegion.querySelector('[data-test-id="legals-accordion-content"]');
    if (contentBox) {
      contentCell = contentBox;
    } else {
      // fallback: use everything inside region
      contentCell = contentRegion;
    }
  }

  // Compose the table rows for the Accordion block
  const rows = [
    ['Accordion (accordion11)'], // Header row matches example exactly
    [titleText, contentCell] // Only one accordion item in this block
  ];

  // Create the accordion block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the source element with the structured block
  element.replaceWith(block);
}
