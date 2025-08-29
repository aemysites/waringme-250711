/* global WebImporter */
export default function parse(element, { document }) {
  // Build table rows
  const rows = [];
  // Header row as in the example
  rows.push(['Accordion (accordion49)']);

  // Each <li> in the <ul> is an accordion item
  const items = element.querySelectorAll(':scope > li');
  items.forEach((item) => {
    // Title: find the button's label inside h3 > button > span.heading__Children-sc-bbpayh-0
    let titleEl = null;
    const h3 = item.querySelector('h3');
    if (h3) {
      const button = h3.querySelector('button');
      if (button) {
        const labelSpan = button.querySelector('span.heading__Children-sc-bbpayh-0');
        if (labelSpan) {
          titleEl = labelSpan;
        } else {
          // fallback: button text node only?
          titleEl = button;
        }
      } else {
        titleEl = h3;
      }
    } else {
      titleEl = item;
    }

    // Content: find content region matching id="...-content"
    let contentEl = null;
    const contentDiv = item.querySelector('[id$="-content"]');
    if (contentDiv) {
      // Look for the deepest markdown or span/div with text
      let found = null;
      // Prefer Markdown elements
      const markdowns = contentDiv.querySelectorAll('[data-skyui-core="Markdown@11.8.0"]');
      if (markdowns.length > 0) {
        found = markdowns[0];
      } else {
        // Fallback: get first span/div with text
        const candidates = contentDiv.querySelectorAll('span, div');
        for (let i = 0; i < candidates.length; i++) {
          if (candidates[i].textContent && candidates[i].textContent.trim().length > 0) {
            found = candidates[i];
            break;
          }
        }
      }
      if (found) {
        contentEl = found;
      } else {
        contentEl = contentDiv;
      }
    } else {
      contentEl = item;
    }

    rows.push([titleEl, contentEl]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
