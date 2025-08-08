/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards2)'];
  const grid = element.querySelector('[data-test-id="product-cards-section"] [data-skyui-core="Grid@11.8.0"]');
  if (!grid) return;

  // Find all cards
  const cards = Array.from(grid.querySelectorAll('div[data-test-id^="product-card-"]'));
  const rows = [headerRow];

  cards.forEach(card => {
    // --- IMAGE ---
    let imageDiv = card.querySelector('[data-test-id="background-image"]');
    let imageEl = '';
    if (imageDiv) {
      let bgImg = imageDiv.style.backgroundImage;
      if (!bgImg) {
        bgImg = window.getComputedStyle(imageDiv).backgroundImage;
      }
      if (bgImg && bgImg !== 'none') {
        const urlMatch = bgImg.match(/url\(["']?(.*?)["']?\)/);
        if (urlMatch && urlMatch[1]) {
          imageEl = document.createElement('img');
          imageEl.src = urlMatch[1];
          imageEl.alt = '';
        }
      }
    }

    // --- CONTENT ---
    const contentParts = [];
    // Title block (h3)
    const h3 = card.querySelector('h3[data-test-id="section-header"]');
    if (h3) {
      // Overline (optional)
      const overline = h3.querySelector('span[data-test-id="overline-text"]');
      if (overline && overline.textContent.trim()) {
        // Use a <div> for overline, keep text
        const overlineDiv = document.createElement('div');
        overlineDiv.textContent = overline.textContent.trim();
        overlineDiv.style.fontSize = 'smaller';
        overlineDiv.style.opacity = '0.7';
        contentParts.push(overlineDiv);
      }
      // Main title
      const titleSpans = h3.querySelectorAll('span:not([data-test-id="overline-text"])');
      if (titleSpans.length) {
        const title = document.createElement('strong');
        title.textContent = Array.from(titleSpans).map(s => s.textContent.trim()).join(' ');
        contentParts.push(title);
      }
    }
    // Description (span or div[data-skyui-core="Markdown@11.8.0"])
    let descEl = card.querySelector('[data-skyui-core="Markdown@11.8.0"]');
    if (descEl) {
      if (descEl.tagName === 'DIV') {
        // If the description is a div, keep its children (may have <br>s)
        Array.from(descEl.childNodes).forEach(n => contentParts.push(n));
      } else {
        contentParts.push(descEl);
      }
    }
    // CTAs (a[data-test-id^="card-"])
    const ctas = Array.from(card.querySelectorAll('a[data-test-id^="card-"]'));
    if (ctas.length) {
      const ctaDiv = document.createElement('div');
      ctas.forEach((cta, i) => {
        ctaDiv.appendChild(cta);
        if (i < ctas.length - 1) ctaDiv.appendChild(document.createTextNode(' '));
      });
      contentParts.push(ctaDiv);
    }

    // Fallback: if no content extracted, add whatever is left
    if (contentParts.length === 0) contentParts.push(...Array.from(card.childNodes));

    rows.push([
      imageEl !== '' ? imageEl : '',
      contentParts
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
