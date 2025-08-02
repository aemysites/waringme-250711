/* global WebImporter */
export default function parse(element, { document }) {
  // Utility to get all card containers (direct children with card-wrapper inside)
  const cardBoxes = Array.from(element.querySelectorAll(':scope > div')).filter(box => box.querySelector('[data-test-id^="card-wrapper-"]'));

  const rows = [
    ['Cards (cards5)'],
  ];

  cardBoxes.forEach((box) => {
    const card = box.querySelector('[data-test-id^="card-wrapper-"]');
    if (!card) return;

    // IMAGE: prefer <img>, else <picture>
    let img = null;
    const imgContainer = card.querySelector('[data-test-id="product-card-background-image"]');
    if (imgContainer) {
      img = imgContainer.querySelector('img') || imgContainer.querySelector('picture');
    }

    // TEXT CONTENT: title, subtitle, description
    // All of these are found in .khNmXf
    let textContent = [];
    const textContainer = card.querySelector('.khNmXf');
    if (textContainer) {
      // Gather all visible children in order, omitting script/style/empty
      Array.from(textContainer.children).forEach(child => {
        // Ignore empty placeholders
        if (
          child.tagName !== 'DIV' && child.tagName !== 'SECTION' && child.tagName !== 'ARTICLE' && child.textContent.trim() === ''
        ) return;
        // Push child, preserving structure/markup
        textContent.push(child);
      });
    }

    // CTA BUTTONS: in .iqMgqF (often only one, sometimes more)
    let ctaCell = null;
    const ctaBox = box.querySelector('.iqMgqF');
    if (ctaBox) {
      // Only add if there is at least one anchor
      const ctas = Array.from(ctaBox.querySelectorAll('a'));
      if (ctas.length) {
        ctaCell = ctas;
      }
    }

    // Combine text content and CTAs in one cell
    const cellContent = [];
    if (textContent.length > 0) cellContent.push(...textContent);
    if (ctaCell) cellContent.push(...ctaCell);

    // Only push row if we have image and text content
    if (img && cellContent.length) {
      rows.push([img, cellContent]);
    }
  });

  // Replace the original element only if at least one card row exists
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
