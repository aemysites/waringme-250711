/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion list (direct ul descendant)
  const accordionList = element.querySelector('ul');
  if (!accordionList) return;
  const items = Array.from(accordionList.children).filter((li) => li.tagName === 'LI');
  // Build the table rows
  const rows = [];
  // Block header must match example exactly
  rows.push(['Accordion (accordion36)']);
  items.forEach((li) => {
    // Title: get the button's heading span
    let titleElem = null;
    const button = li.querySelector('h3 button');
    if (button) {
      // The main text is in the span with class 'heading__Children-sc-bbpayh-0'
      const span = button.querySelector('.heading__Children-sc-bbpayh-0');
      if (span) {
        titleElem = span;
      } else {
        // fallback: use the button text itself as a span
        const s = document.createElement('span');
        s.textContent = button.textContent.trim();
        titleElem = s;
      }
    } else {
      // fallback: use the first <h3> as the title
      const h3 = li.querySelector('h3');
      if (h3) {
        titleElem = h3;
      } else {
        // fallback: empty cell
        titleElem = document.createElement('span');
      }
    }
    // Content: it's inside the region div, look for the main answer block
    let contentElem = null;
    const region = li.querySelector('div[role="region"]');
    if (region) {
      const answer = region.querySelector('[data-test-id="faq-content"]');
      if (answer) {
        contentElem = answer;
      } else {
        // Fallback: use visible content region
        contentElem = region;
      }
    } else {
      // fallback: empty cell
      contentElem = document.createElement('span');
    }
    rows.push([titleElem, contentElem]);
  });
  // Build and replace with the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
