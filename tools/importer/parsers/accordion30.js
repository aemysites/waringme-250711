/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion wrapper
  const accordion = element.querySelector('[data-skyui-core^="Accordion"]');
  if (!accordion) return;

  // Header row: matches EXACTLY the block name in the example
  const cells = [
    ['Accordion (accordion30)']
  ];

  // Try to find the title text from the accordion button
  let titleText = '';
  const button = accordion.querySelector('h2 button');
  if (button) {
    // The real text is usually the first span span inside the button
    const labelSpan = button.querySelector('span span');
    titleText = labelSpan ? labelSpan.textContent.trim() : button.textContent.trim();
  }

  // Find the content element for the accordion item
  // This is a deeply nested element with the Markdown content
  let contentElement = null;
  const contentRegion = accordion.querySelector('[id$="-content"]');
  if (contentRegion) {
    // content__Inner-sc-m4v15p-0 is an inner container, but the real content is deeper
    contentElement = contentRegion.querySelector('[data-test-id="legals-accordion-content"]');
    if (!contentElement) {
      // Fallback: use any child with data-skyui-core=Markdown
      contentElement = contentRegion.querySelector('[data-skyui-core^="Markdown"]');
    }
    if (!contentElement) {
      // Fallback: use the contentRegion itself
      contentElement = contentRegion;
    }
  }

  // Edge case: if no content, create an empty div for cell
  if (!contentElement) {
    contentElement = document.createElement('div');
  }

  // Create a div for the title exactly as in the HTML (not markdown or string)
  const titleDiv = document.createElement('div');
  titleDiv.textContent = titleText;

  // Accordion table is always one row: [titleCell, contentCell]
  cells.push([
    titleDiv,
    contentElement
  ]);

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
