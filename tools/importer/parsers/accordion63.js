/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches exactly as required
  const headerRow = ['Accordion (accordion63)'];
  // Get all immediate <li> children (accordion items)
  const items = Array.from(element.children);
  const rows = items.map((li) => {
    // Title cell: find the button text (generally in span.heading__Children-sc-bbpayh-0)
    let titleSpan = li.querySelector('h3 > button > span.heading__Children-sc-bbpayh-0');
    // Fallback to the full button if needed
    let titleCell = titleSpan ? titleSpan : li.querySelector('h3 > button');
    // Content cell: deepest Markdown or Box (contains answer/body content)
    let contentRegion = li.querySelector('div[role="region"]');
    let contentCell = null;
    if (contentRegion) {
      // Try to find deepest element with data-skyui-core="Markdown@..."
      contentCell = contentRegion.querySelector('[data-skyui-core^="Markdown@"]');
      // Fallback: deepest Box
      if (!contentCell) {
        contentCell = contentRegion.querySelector('[data-skyui-core^="Box@"]');
      }
      // Fallback: use content region itself
      if (!contentCell) {
        contentCell = contentRegion;
      }
    }
    // If no title or content, use empty string to avoid breaking table
    return [titleCell || '', contentCell || ''];
  });
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
