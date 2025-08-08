/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion wrapper
  const accordion = element.querySelector('[data-skyui-core^="Accordion"]');
  if (!accordion) return;

  // Get the heading/title for the accordion
  let headingTitle = '';
  const headingButton = accordion.querySelector('h2 button');
  if (headingButton) {
    const span = headingButton.querySelector('span span');
    if (span) headingTitle = span.textContent.trim();
    else headingTitle = headingButton.textContent.trim();
  }

  // Get the content element (allowing for content to be hidden)
  let contentEl = null;
  const contentPanel = accordion.querySelector('[role="region"]');
  if (contentPanel) {
    contentEl = contentPanel.querySelector('[data-test-id="legals-accordion-content"]');
    if (!contentEl) {
      const inner = contentPanel.querySelector('.content__Inner-sc-m4v15p-0');
      if (inner) contentEl = inner;
    }
  }
  if (!contentEl) return;

  // Header row as single cell (will be colspan=2 when rendered)
  const rows = [
    ['Accordion (accordion36)'], // This will be rendered as colspan=2
    [headingTitle, contentEl],
  ];
  
  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
