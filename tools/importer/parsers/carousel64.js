/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare rows, starting with block header
  const rows = [['Carousel (carousel64)']];

  // Get all main card wrappers/slides
  const cardWrappers = Array.from(element.querySelectorAll('[data-test-id^="card-wrapper-"]'));

  cardWrappers.forEach(cardWrapper => {
    // --- IMAGE CELL ---
    let imgCell = '';
    const imgWrap = cardWrapper.querySelector('[data-test-id="product-card-background-image"]');
    if (imgWrap) {
      const imgEl = imgWrap.querySelector('img');
      if (imgEl) {
        imgCell = imgEl;
      }
    }

    // --- TEXT CELL ---
    const textCellEls = [];

    // Badge (optional)
    const badgeWrapper = cardWrapper.querySelector('.sc-jMbVJB');
    if (badgeWrapper) {
      const badgeSpan = badgeWrapper.querySelector('span');
      if (badgeSpan && badgeSpan.textContent.trim()) {
        // Use a <strong> for badge
        const badgeEl = document.createElement('strong');
        badgeEl.textContent = badgeSpan.textContent.trim();
        textCellEls.push(badgeEl);
      }
    }

    // Title (h2)
    const title = cardWrapper.querySelector('h2[data-test-id="section-header"]');
    if (title) {
      textCellEls.push(title);
    }

    // Descriptions (span[data-skyui-core="Markdown@11.8.1"]) -- wrap each in <p>
    const descSpans = cardWrapper.querySelectorAll('[data-skyui-core="Markdown@11.8.1"]');
    descSpans.forEach(descSpan => {
      if (descSpan.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = descSpan.textContent.trim();
        textCellEls.push(p);
      }
    });

    // CTA links: only from relevant Flex container
    // Find the first Flex child at the right depth
    const ctaFlex = Array.from(cardWrapper.querySelectorAll('[data-test-id^="card-"][data-skyui-core="Flex@11.8.1"]')).filter(flex => flex.querySelector('a'))[0];
    if (ctaFlex) {
      const links = Array.from(ctaFlex.querySelectorAll('a'));
      links.forEach((link, idx) => {
        // direct reference, not clone
        if (idx > 0) textCellEls.push(document.createTextNode(' '));
        textCellEls.push(link);
      });
    }

    // Add the row for this slide
    rows.push([ imgCell, textCellEls ]);
  });

  // Create table and replace original
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
