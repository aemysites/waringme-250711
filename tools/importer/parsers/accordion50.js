/* global WebImporter */
export default function parse(element, { document }) {
  // Header row per spec and example
  const headerRow = ['Accordion (accordion50)'];
  const rows = [headerRow];

  // Each immediate <li> is an accordion item
  const items = element.querySelectorAll(':scope > li');
  items.forEach((li) => {
    // Title: get the span.heading__Children-sc-bbpayh-0 inside the button
    let title = '';
    const button = li.querySelector('h3 button');
    if (button) {
      // Use the first span with heading__Children-sc-bbpayh-0 if present
      const headingSpan = button.querySelector('span.heading__Children-sc-bbpayh-0');
      if (headingSpan) {
        title = headingSpan;
      } else {
        // fallback: use button's textContent
        title = document.createTextNode(button.textContent.trim());
      }
    }
    // Content: find the region and use innermost Markdown/Box, fallback as needed
    let content = '';
    const region = li.querySelector('[role="region"]');
    if (region) {
      // Try to find a Markdown element inside
      let markdown = region.querySelector('[data-skyui-core^="Markdown@"][data-skyui-core*=".0"]');
      if (!markdown) {
        // fallback to innermost .box__Box-sc-1i8zs0c-0.hRrpms
        markdown = region.querySelector('.box__Box-sc-1i8zs0c-0.hRrpms');
        if (!markdown) {
          // fallback to innermost .content__Inner-sc-m4v15p-0
          markdown = region.querySelector('.content__Inner-sc-m4v15p-0');
          if (!markdown) {
            // fallback to region itself
            markdown = region;
          }
        }
      }
      content = markdown;
    }
    rows.push([title, content]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
