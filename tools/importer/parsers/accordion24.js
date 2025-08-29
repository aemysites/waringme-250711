/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion root; it's the element with Accordion@... in data-skyui-core
  let accordionEl = element.querySelector('[data-skyui-core^="Accordion"]');
  if (!accordionEl) {
    // As fallback, maybe element itself is the accordion
    if (element.getAttribute('data-skyui-core') && element.getAttribute('data-skyui-core').startsWith('Accordion')) {
      accordionEl = element;
    }
  }
  if (!accordionEl) {
    // Defensive: if not found, exit
    return;
  }

  // Get the header: it's the button label inside h2 > button, usually wrapped in spans
  let headerBtn = accordionEl.querySelector('h2 > button');
  let headerContent = null;
  if (headerBtn) {
    // Usually there is a span.heading__Children-sc-bbpayh-0 inside
    headerContent = headerBtn.querySelector('.heading__Children-sc-bbpayh-0, .heading__Children');
    if (!headerContent) headerContent = headerBtn;
  }

  // Get the content: aria-controls and region with id ...accordion...-content
  let contentRegion = accordionEl.querySelector('[role="region"], [aria-labelledby]');
  if (!contentRegion) {
    // Defensive fallback: get any child div
    contentRegion = accordionEl.querySelector('div');
  }

  // Get the actual content container inside the region
  let content = contentRegion.querySelector('.content__Inner-sc-m4v15p-0, .content__Inner');
  if (!content) {
    // Fallback: maybe direct children
    content = contentRegion;
  }

  // Defensive: if we didn't find meaningful header or content, exit
  if (!headerContent || !content) {
    return;
  }

  // Compose content cell: reference all children of the inner content container
  let contentCell;
  // If only one child, use it directly, else use array
  const children = Array.from(content.childNodes).filter(node => {
    // Remove empty text nodes
    return !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim());
  });
  if (children.length === 1) {
    contentCell = children[0];
  } else {
    contentCell = children;
  }

  // Block header exactly as spec
  const rows = [['Accordion (accordion24)']];
  // Add one row (title cell, content cell)
  rows.push([headerContent, contentCell]);

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
