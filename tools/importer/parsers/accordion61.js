/* global WebImporter */
export default function parse(element, { document }) {
  // Setup header row
  const headerRow = ['Accordion (accordion61)'];
  const rows = [headerRow];

  // Select all direct li children (accordion items)
  const items = element.querySelectorAll(':scope > li');
  items.forEach((li) => {
    // Find the title cell: the span inside button with heading__Children-sc-bbpayh-0 class
    let title = li.querySelector('button .heading__Children-sc-bbpayh-0');
    // Fallback: first span inside button
    if (!title) {
      const btn = li.querySelector('button');
      if (btn) {
        title = btn.querySelector('span');
      }
    }
    // As ultimate fallback, use button itself (should rarely happen)
    if (!title) {
      title = li.querySelector('button');
    }

    /*
      Content: We want the actual content for the accordion. This is deeply nested:
      - div[id$='-content'] > div > div[data-test-id=faq-content] > ...-> [data-skyui-core='Markdown@11.8.0']
      Sometimes it's a span.
      To be robust, find the region first, then the markdown content within.
    */
    let contentRegion = li.querySelector('div[id$="-content"]');
    let content = null;
    if (contentRegion) {
      // Try to find the markdown direct child
      content = contentRegion.querySelector('[data-skyui-core="Markdown@11.8.0"]');
      // Sometimes it's wrapped in several divs, so check for any such descendant
      if (!content) {
        const boxes = contentRegion.querySelectorAll('[data-skyui-core="Box@11.8.0"]');
        for (const box of boxes) {
          const maybeMarkdown = box.querySelector('[data-skyui-core="Markdown@11.8.0"]');
          if (maybeMarkdown) {
            content = maybeMarkdown;
            break;
          }
        }
      }
      // Sometimes it's a span
      if (!content) {
        content = contentRegion.querySelector('span[data-skyui-core="Markdown@11.8.0"]');
      }
      // As last resort, use the content region itself
      if (!content) {
        content = contentRegion;
      }
    }
    // If content region not found, fallback to looking for any markdown within li
    if (!content) {
      content = li.querySelector('[data-skyui-core="Markdown@11.8.0"]');
    }

    // Push title and content as a row
    rows.push([title, content]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
