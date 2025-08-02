/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Hero (hero19)'];

  // --- Row 2: Background Image ---
  // Find the main hero image (background)
  let bgImg = null;
  const heroMaskBox = element.querySelector('.Hero__MaskBox-sc-f6nat5-1');
  if (heroMaskBox) {
    bgImg = heroMaskBox.querySelector('img');
  }
  const bgRow = [bgImg ? bgImg : ''];

  // --- Row 3: Content ---
  // Compose the content div, using only elements from the document
  const contentDiv = document.createElement('div');

  // Get logo image (the smaller logo in the content area)
  const logoImg = element.querySelector('.bMVJpf img');
  if (logoImg) {
    contentDiv.appendChild(logoImg);
  }

  // Main heading (h1 -- visually hidden in the DOM but should be visible in block)
  const mainHeading = element.querySelector('.bMVJpf h1');
  if (mainHeading) {
    const h1 = document.createElement('h1');
    h1.textContent = mainHeading.textContent;
    contentDiv.appendChild(h1);
  }

  // Subheading (h2)
  const subHeading = element.querySelector('.bMVJpf h2');
  if (subHeading) {
    contentDiv.appendChild(subHeading);
  }

  // CTAs
  const ctas = element.querySelector('[data-test-id="show.hero.ctas"]');
  if (ctas) {
    // Collect only direct <a> children of CTAs
    const ctaLinks = Array.from(ctas.querySelectorAll('a'));
    if (ctaLinks.length > 0) {
      const ctaDiv = document.createElement('div');
      ctaLinks.forEach(a => ctaDiv.appendChild(a));
      contentDiv.appendChild(ctaDiv);
    }
  }

  // Supporting/description text (strong in span.fKxLCo)
  const descSpan = element.querySelector('.fKxLCo');
  if (descSpan && descSpan.textContent.trim()) {
    // We use a <p> tag for the supporting text
    const p = document.createElement('p');
    p.innerHTML = descSpan.innerHTML;
    contentDiv.appendChild(p);
  }

  const contentRow = [contentDiv];

  // Compose table and replace
  const cells = [
    headerRow,
    bgRow,
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
