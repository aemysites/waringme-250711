/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion wrapper section
  const accordion = element.querySelector('[data-skyui-core^="Accordion@"][id^="accordion-"]');
  if (!accordion) return;

  // Get the button inside h2 for the title
  const headerButton = accordion.querySelector('h2 button');
  let titleText = '';
  if (headerButton) {
    // Use the innermost span with text for the most accurate title
    const titleSpan = headerButton.querySelector('span span');
    if (titleSpan) {
      titleText = titleSpan.textContent.trim();
    } else {
      titleText = headerButton.textContent.trim();
    }
  }

  // Content region (the expanded content area)
  const contentWrapper = accordion.querySelector('[role="region"]');
  let contentElem = null;
  if (contentWrapper) {
    // The main content is usually in data-test-id="legals-accordion-content"
    contentElem = contentWrapper.querySelector('[data-test-id="legals-accordion-content"]');
    // If not found, just use the contentWrapper itself
    if (!contentElem) contentElem = contentWrapper;
  }

  // If either the title or the content is missing, skip
  if (!titleText || !contentElem) return;

  // Build the table rows: first the header, then 1 row per accordion item (just 1 in this case)
  const headerRow = ['Accordion (accordion10)'];
  const blockRows = [[titleText, contentElem]];
  const cells = [headerRow, ...blockRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
