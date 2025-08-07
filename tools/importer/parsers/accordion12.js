/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as per instructions
  const headerRow = ['Accordion (accordion12)'];

  // Find the UL containing accordion items (must exist for the block)
  const ul = element.querySelector('ul');
  if (!ul) return;

  // Each LI is an accordion item: title in the button span, content in the answer div
  const items = Array.from(ul.children);
  const rows = items.map((li) => {
    // Title: get <span class="heading__Children-sc-bbpayh-0 ..."> inside button
    let titleEl = li.querySelector('button .heading__Children-sc-bbpayh-0');
    if (!titleEl) {
      // fallback: use button text or the button itself
      const btn = li.querySelector('button');
      titleEl = btn ? btn : '';
    }

    // Content: find the content div (may be deeply nested)
    let contentEl = '';
    const contentDiv = li.querySelector('[id$="-content"]');
    if (contentDiv) {
      // prefer the innermost answer content (markdown, box, etc.)
      // Look for data-test-id="faq-content" or data-skyui-core="Markdown@11.8.0"
      let inner = contentDiv.querySelector('[data-test-id="faq-content"]');
      if (!inner) {
        inner = contentDiv.querySelector('[data-skyui-core="Markdown@11.8.0"]');
      }
      if (!inner) {
        inner = contentDiv.querySelector('[data-skyui-core="Box@11.8.0"]');
      }
      contentEl = inner ? inner : contentDiv;
    }
    return [titleEl, contentEl];
  });

  // Compose the table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
