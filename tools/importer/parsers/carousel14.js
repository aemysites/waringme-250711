/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match example
  const headerRow = ['Carousel (carousel14)'];

  // Find the slides container (ul)
  const slidesContainer = element.querySelector('ul');
  if (!slidesContainer) return;
  const slides = slidesContainer.querySelectorAll('li');

  const rows = [];
  slides.forEach((li) => {
    // Each li contains an a[data-test-id="carousel-card"]
    const link = li.querySelector('a[data-test-id="carousel-card"]');
    if (!link) return;

    // --- IMAGE extraction: Get first .sc-cCzLxZ img (main visual) ---
    let mainImg = null;
    const imgWrap = link.querySelector('.sc-cCzLxZ');
    if (imgWrap) {
      // The first img inside this is the slide visual (brand/overlay logo is second img, if present)
      const imgs = imgWrap.querySelectorAll('img');
      if (imgs[0]) mainImg = imgs[0];
    }
    // Fallback: skip this slide if no main image
    if (!mainImg) return;

    // --- TEXT extraction ---
    // All content in slide-footer-default
    const contentWrap = link.querySelector('[data-test-id^="slide-footer-default"]');
    let contentElements = [];
    if(contentWrap) {
      // In markup: <p> = title, <h3> = description
      const title = contentWrap.querySelector('p');
      const desc = contentWrap.querySelector('h3');
      if (title) {
        // Use <strong> to match bold heading style (example uses heading, but not h2/h3 directly)
        const strong = document.createElement('strong');
        strong.textContent = title.textContent;
        contentElements.push(strong);
      }
      if (desc) {
        // Use a paragraph element for description
        const p = document.createElement('p');
        p.textContent = desc.textContent;
        contentElements.push(p);
      }
    }
    // Compose the row: always image, text (may be empty)
    rows.push([mainImg, contentElements.length ? contentElements : '']);
  });

  if (rows.length === 0) return;

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
