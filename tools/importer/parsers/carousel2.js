/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row, matching the exact block name
  const headerRow = ['Carousel (carousel2)'];
  const rows = [headerRow];

  // 2. Find the carousel list of slides
  const ul = element.querySelector('ul.items__Element-sc-behb7x-0');
  if (!ul) return;
  const items = ul.querySelectorAll(':scope > li');

  // 3. Extract the overall carousel heading (above the slides), only for first slide
  let mainHeading = '';
  const headingDiv = element.querySelector('.rail__RailHeader-sc-15fuqfg-1');
  if (headingDiv) {
    const h2 = headingDiv.querySelector('h2');
    if (h2) mainHeading = h2.textContent.trim();
  }

  items.forEach((li, idx) => {
    // Main image: first image inside the anchor (ignore overlay glare img)
    let mainImg = null;
    const anchor = li.querySelector('a');
    if (anchor) {
      const imgs = anchor.querySelectorAll('img');
      mainImg = Array.from(imgs).find(img => img.alt && img.alt.trim().length > 0) || imgs[0] || '';
    }

    // Compose text content cell
    // Collect all direct and indirect text content relevant to this slide
    const textCellParts = [];
    // Main carousel heading as h2 (on first slide)
    if (idx === 0 && mainHeading) {
      const h2 = document.createElement('h2');
      h2.textContent = mainHeading;
      textCellParts.push(h2);
    }
    // Title/Label (as heading, from visible slide label)
    // Find all child spans with visible text
    const textSpans = li.querySelectorAll('span');
    textSpans.forEach(span => {
      const text = span.textContent.trim();
      if (text) {
        // Use h3 for slide titles (semantics)
        const h3 = document.createElement('h3');
        h3.textContent = text;
        textCellParts.push(h3);
      }
    });
    // Add any additional visible text from other elements (if present)
    // For this structure, all slide descriptions are in the span(s)

    // If no text, provide empty string for cell
    const textCell = textCellParts.length ? textCellParts : '';
    rows.push([mainImg, textCell]);
  });

  // Replace the original element with the new table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
