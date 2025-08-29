/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero66) block table: 1 col, 3 rows
  // 1. Header row
  const headerRow = ['Hero (hero66)'];

  // 2. Background image row (none present in provided HTML)
  const bgRow = [''];

  // 3. Content row
  // Collect the heading (h1 or equivalent)
  const title = element.querySelector('h1');
  // Collect the subheading/paragraph
  // We'll look for a .UByi or the first .text__TextElement-sc-qf7y4e-0 inside the row after the h1
  let subheading = null;
  const subCand = Array.from(element.querySelectorAll('div.text__TextElement-sc-qf7y4e-0'))
    .find(d => d !== title && d.textContent && d.textContent.trim() && d.classList.contains('UByi'));
  if (subCand) {
    subheading = subCand;
  } else {
    // fallback: any span under .text__TextElement-sc-qf7y4e-0 that is not inside h1
    const alt = Array.from(element.querySelectorAll('div.text__TextElement-sc-qf7y4e-0 span'))
      .find(sp => !title || !title.contains(sp));
    if (alt) subheading = alt;
  }

  // Collect CTA (look for a Button@ link)
  const cta = element.querySelector('a[data-skyui-core^="Button@"]');

  // Compose the content row, skipping nulls
  const contentParts = [];
  if (title) contentParts.push(title);
  if (subheading) contentParts.push(subheading);
  if (cta) contentParts.push(cta);

  const contentRow = [contentParts];

  // Final table creation
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgRow,
    contentRow
  ], document);
  
  element.replaceWith(table);
}
