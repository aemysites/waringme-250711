/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion15 block table
  // Header must be exactly as in the example
  const headerRow = ['Accordion (accordion15)'];
  const rows = [headerRow];

  // Each accordion item is a <li> in the provided <ul>
  const items = element.querySelectorAll(':scope > li');
  items.forEach((li) => {
    // Title cell: get the visible question/title from the button span
    let titleCell = '';
    const h3 = li.querySelector('h3');
    if (h3) {
      const button = h3.querySelector('button');
      if (button) {
        // This span contains the main visible text
        const mainSpan = button.querySelector('span.heading__Children-sc-bbpayh-0');
        if (mainSpan) {
          titleCell = mainSpan;
        } else {
          // fallback: just use the button's text
          titleCell = document.createElement('span');
          titleCell.textContent = button.textContent.trim();
        }
      }
    }
    if (!titleCell) {
      // fallback: empty cell
      titleCell = '';
    }
    
    // Content cell: get the main content from the answer/region
    let contentCell = '';
    // The answer content is in a region div
    const region = li.querySelector('div[role="region"]');
    if (region) {
      // The meaningful content is inside .content__Inner-sc-m4v15p-0
      // which contains the answer, including markup
      const inner = region.querySelector('.content__Inner-sc-m4v15p-0');
      if (inner) {
        contentCell = inner;
      } else {
        // fallback: use region itself
        contentCell = region;
      }
    }
    rows.push([titleCell, contentCell]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
