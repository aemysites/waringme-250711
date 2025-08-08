/* global WebImporter */
export default function parse(element, { document }) {
  // Try to extract background image from known pattern (background image on .sc-ifyrAs.jkjqhE)
  let backgroundImg = null;
  const bgDiv = element.querySelector('[data-test-id="background-image"]');
  if (bgDiv) {
    // Try inline style first
    let bgUrl = '';
    if (bgDiv.style && bgDiv.style.backgroundImage) {
      const match = bgDiv.style.backgroundImage.match(/url\((['"]?)([^'"]+)\1\)/);
      if (match && match[2]) bgUrl = match[2];
    }
    // Fallback: check if a background-image is set as a CSS variable (sometimes set as --bg or similar)
    if (!bgUrl) {
      const style = window.getComputedStyle ? window.getComputedStyle(bgDiv) : null;
      if (style && style.backgroundImage && style.backgroundImage !== 'none') {
        const match = style.backgroundImage.match(/url\((['"]?)([^'"]+)\1\)/);
        if (match && match[2]) bgUrl = match[2];
      }
    }
    // If we found a URL, create an <img>
    if (bgUrl) {
      const img = document.createElement('img');
      img.src = bgUrl;
      backgroundImg = img;
    }
  }

  // Find the main content area (heading, subheading, CTA)
  const card = element.querySelector('[data-test-id="product-card-0"]');
  let contentCell = [];
  if (card) {
    // Heading
    const heading = card.querySelector('h1, h2, h3');
    if (heading && heading.textContent.trim()) contentCell.push(heading);
    // Subheading/paragraph
    const subtext = card.querySelector('span[data-skyui-core^="Markdown"], .text__TextElement-sc-qf7y4e-0.bHVGAy');
    if (subtext) {
      const subtextDiv = subtext.closest('.text__TextElement-sc-qf7y4e-0');
      if (subtextDiv) contentCell.push(subtextDiv);
      else contentCell.push(subtext);
    }
    // CTA
    const cta = card.querySelector('a[data-test-id^="card-0-cta-"]');
    if (cta) contentCell.push(cta);
  }

  // Construct rows as per the markdown example: header, background image, content
  const rows = [
    ['Hero (hero12)'],
    [backgroundImg ? backgroundImg : ''],
    [contentCell.length > 0 ? contentCell : '']
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
