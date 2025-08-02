/* global WebImporter */
export default function parse(element, { document }) {
  // Build rows array for the cards block table
  const rows = [
    ['Cards (cards4)'] // header row exactly as in the example
  ];

  // Each card is within a [data-test-id^="card-wrapper-"] element
  const cardWrappers = Array.from(element.querySelectorAll('[data-test-id^="card-wrapper-"]'));

  cardWrappers.forEach((cardWrapper) => {
    // 1. Extract the card image (first cell)
    let image = null;
    const imgContainer = cardWrapper.querySelector('[data-test-id="product-card-background-image"]');
    if (imgContainer) {
      image = imgContainer.querySelector('img');
    }

    // 2. Extract card text content (second cell)
    // We'll collect references to direct descendants where possible
    const textCell = [];

    // Extract badge/label (e.g. "New", "2025") -- must preserve if present
    const badge = cardWrapper.querySelector('.sc-iBdnpw');
    if (badge && badge.textContent.trim()) {
      textCell.push(badge);
    }

    // Extract heading (h2)
    const heading = cardWrapper.querySelector('h2');
    if (heading) {
      textCell.push(heading);
    }

    // Extract main description/price row
    // Usually the first occurrence of a Markdown span (higher up in the tree)
    const priceDesc = cardWrapper.querySelector('[data-skyui-core*="Markdown"]');
    if (priceDesc && priceDesc.textContent.trim()) {
      // Wrap in a <p> for semantic meaning as in the example
      const p = document.createElement('p');
      p.textContent = priceDesc.textContent;
      textCell.push(p);
    }

    // Extract further description (second box after the price)
    // It's usually in a .ePJRTi box
    const descs = cardWrapper.querySelectorAll('.box__Box-sc-1i8zs0c-0.ePJRTi .text__TextElement-sc-qf7y4e-0');
    descs.forEach((desc) => {
      if (desc.textContent && desc.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = desc.textContent;
        textCell.push(p);
      }
    });

    // Extract CTA buttons (if any)
    // All links inside the cQvQJT container
    const ctaBox = cardWrapper.querySelector('.cQvQJT');
    if (ctaBox) {
      const ctas = Array.from(ctaBox.querySelectorAll('a'));
      ctas.forEach((cta) => textCell.push(cta));
    }

    rows.push([
      image,
      textCell
    ]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
