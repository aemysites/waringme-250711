/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main accordion wrapper
  const accordionWrapper = element.querySelector('[data-skyui-core^="Accordion@"][class*="wrapper__Wrapper"]');
  if (!accordionWrapper) return;

  // Find the button containing the accordion title
  const button = accordionWrapper.querySelector('button');
  let title = '';
  if (button) {
    // Get the innermost span text or fallback to whole button
    const span = button.querySelector('span span');
    title = span ? span.textContent.trim() : button.textContent.trim();
  }

  // Find the visible accordion content
  const contentWrapper = accordionWrapper.querySelector('[id$="-content"]');
  let contentCell = null;
  if (contentWrapper) {
    // Look for a Markdown block inside the content
    const markdown = contentWrapper.querySelector('[data-skyui-core^="Markdown@"]');
    // If found, use it directly; otherwise fallback to the whole content wrapper
    contentCell = markdown || contentWrapper;
  }

  // Compose the block table as in the example: header, then a row for this accordion item
  const cells = [
    ['Accordion (accordion10)'],
    [title, contentCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
