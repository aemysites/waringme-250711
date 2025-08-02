/* global WebImporter */
export default function parse(element, { document }) {
  // Find the <ul> containing the Accordion items
  const faqList = element.querySelector('ul');
  if (!faqList) return;

  const headerRow = ['Accordion (accordion3)'];
  const rows = [headerRow];

  // Each <li> is an accordion item
  const faqItems = Array.from(faqList.children);

  faqItems.forEach((li) => {
    // Title cell: The question is inside button > span.heading__Children-sc-bbpayh-0
    let titleEl = null;
    const button = li.querySelector('button');
    if (button) {
      // The visible question text
      titleEl = button.querySelector('span.heading__Children-sc-bbpayh-0');
      // If not found, fallback to button text
      if (!titleEl && button.textContent) {
        titleEl = document.createElement('span');
        titleEl.textContent = button.textContent.trim();
      }
    }
    if (!titleEl) {
      titleEl = document.createElement('span');
      titleEl.textContent = '';
    }

    // Content cell: The answer is in div[role=region] > div.content__Inner-sc-m4v15p-0
    let contentEl = li.querySelector('div[role="region"] .content__Inner-sc-m4v15p-0');
    if (!contentEl) {
      // fallback to just the region
      contentEl = li.querySelector('div[role="region"]');
    }
    if (!contentEl) {
      contentEl = document.createElement('div');
      contentEl.textContent = '';
    }

    rows.push([titleEl, contentEl]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
