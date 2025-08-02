/* global WebImporter */
export default function parse(element, { document }) {
  // Table header is exactly as specified
  const headerRow = ['Cards (cards26)'];
  // Find the cards container
  const cardsSection = element.querySelector('[data-test-id="product-cards-section"]');
  if (!cardsSection) return;
  // Find all product card root elements
  const cardNodes = Array.from(cardsSection.querySelectorAll('[data-test-id^="product-card-"]'));
  const rows = cardNodes.map(card => {
    // 1. IMAGE COLUMN (extract background-image)
    let imageEl = '';
    const bgDiv = card.querySelector('[data-test-id="background-image"]');
    if (bgDiv) {
      // Try CSS background-image
      let imgUrl = '';
      const style = bgDiv.getAttribute('style');
      if (style) {
        const match = style.match(/background-image\s*:\s*url\(['"]?([^'")]+)['"]?\)/i);
        if (match) {
          imgUrl = match[1];
        }
      }
      // fallback: if no CSS style, check for a data attribute (uncommon for this markup)
      if (!imgUrl && bgDiv.getAttribute('data-background-image-url')) {
        imgUrl = bgDiv.getAttribute('data-background-image-url');
      }
      if (imgUrl) {
        imageEl = document.createElement('img');
        imageEl.src = imgUrl;
        imageEl.setAttribute('loading', 'lazy');
      }
    }
    // 2. TEXT COLUMN
    // -- Title (two spans inside h3), overline and headline
    // -- Description (Markdown span/div)
    // -- CTAs (buttons/links)
    const contentFragments = [];
    const header = card.querySelector('[data-test-id="section-header"]');
    if (header) {
      // Overline text (optional, always first span)
      const spans = header.querySelectorAll('span');
      if (spans.length > 0 && spans[0].textContent.trim()) {
        const overlineDiv = document.createElement('div');
        overlineDiv.textContent = spans[0].textContent.trim();
        overlineDiv.style.fontSize = 'smaller';
        contentFragments.push(overlineDiv);
      }
      // Headline (second span, or first if only one)
      const headlineIdx = spans.length > 1 ? 1 : 0;
      if (spans.length > headlineIdx && spans[headlineIdx].textContent.trim()) {
        const headlineStrong = document.createElement('strong');
        headlineStrong.textContent = spans[headlineIdx].textContent.trim();
        contentFragments.push(headlineStrong);
      }
    }
    // Description (Markdown block, can be span or div)
    const markdown = card.querySelector('[data-skyui-core="Markdown@11.8.0"]');
    if (markdown) {
      if (markdown.textContent.trim()) {
        // To preserve markup (such as <br>), use innerHTML
        const descDiv = document.createElement('div');
        descDiv.innerHTML = markdown.innerHTML;
        contentFragments.push(descDiv);
      }
    }
    // CTAs
    // Find the cta button group: [data-test-id^='card-X-cta'] and is a Flex
    const ctaFlex = card.querySelector('[data-test-id^="card-"][data-skyui-core="Flex@11.8.0"]');
    if (ctaFlex) {
      const ctaLinks = Array.from(ctaFlex.querySelectorAll('a'));
      if (ctaLinks.length > 0) {
        const ctaWrapper = document.createElement('div');
        ctaWrapper.style.marginTop = '1em';
        ctaLinks.forEach(a => {
          // Use the existing <a> reference, but strip unnecessary attributes/classes
          a.removeAttribute('class');
          a.removeAttribute('data-tracking-description');
          a.removeAttribute('data-tracking-label');
          a.removeAttribute('data-tracking-location');
          a.removeAttribute('data-test-id');
          a.removeAttribute('data-skyui-core');
          // Remove button-specific style if present
          a.style.marginRight = '0.5em';
          // If it has only a span child, use just the span's text
          if (a.childElementCount === 1 && a.firstElementChild.tagName === 'SPAN') {
            a.textContent = a.firstElementChild.textContent;
          }
          ctaWrapper.appendChild(a);
        });
        contentFragments.push(ctaWrapper);
      }
    }
    // Build this card's row: always two columns
    return [imageEl || '', contentFragments];
  });
  // Compose whole block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  // Replace the original element
  element.replaceWith(table);
}
