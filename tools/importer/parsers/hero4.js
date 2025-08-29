/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const rows = [['Hero (hero4)']];

  // 2. Background image row (always present; blank if no background image can be found)
  let bgImg = null;
  const bgDiv = element.querySelector('[data-test-id="background-image"]');
  if (bgDiv) {
    const computedStyle = bgDiv.ownerDocument.defaultView.getComputedStyle(bgDiv);
    const bgMatch = computedStyle.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
    if (bgMatch && bgMatch[1] && bgMatch[1] !== 'none') {
      const img = document.createElement('img');
      img.src = bgMatch[1];
      bgImg = img;
    }
  }
  if (!bgImg) {
    const img = element.querySelector('img');
    if (img) bgImg = img;
  }
  rows.push([bgImg ? bgImg : '']);

  // 3. Content row (text, headings, CTA) - always present
  // The primary card element for text/buttons
  const card = element.querySelector('[data-test-id^="product-card"]') || element;
  const contentEls = [];

  // Gather all headings
  card.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
    if (h.textContent.trim()) contentEls.push(h);
  });
  // Gather all paragraphs not in headings
  card.querySelectorAll('p').forEach(p => {
    if (p.textContent.trim() && !contentEls.includes(p)) contentEls.push(p);
  });
  // Gather text blocks not already included
  card.querySelectorAll('[data-skyui-core*="Text"], .text__TextElement-sc-qf7y4e-0').forEach(el => {
    if (el.closest('h1,h2,h3,h4,h5,h6,p')) return;
    if (el.textContent && el.textContent.trim() && !contentEls.includes(el)) {
      contentEls.push(el);
    }
  });
  // Gather CTA links/buttons not already included
  card.querySelectorAll('a,button').forEach(a => {
    if (a.textContent && a.textContent.trim() && !contentEls.includes(a)) {
      contentEls.push(a);
    }
  });
  // Remove duplicates
  const seen = new Set();
  const uniqueContentEls = contentEls.filter(el => {
    if (seen.has(el)) return false;
    seen.add(el);
    return true;
  });
  rows.push([uniqueContentEls]);

  // 4. Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
