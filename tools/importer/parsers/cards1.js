/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as exactly in example
  const headerRow = ['Cards (cards1)'];
  const rows = [headerRow];

  // Find all product-card blocks (each is a card)
  const cards = Array.from(element.querySelectorAll('[data-test-id^="product-card-"]'));

  cards.forEach(card => {
    // 1. Image/Icon cell
    let imageCell = null;
    // Use the card's background image div (always present)
    const bgDiv = card.querySelector('.sc-jiSpbx');
    if (bgDiv) {
      // If there's a real <img>, use it. Otherwise, use bgDiv.
      const img = bgDiv.querySelector('img');
      imageCell = img ? img : bgDiv;
    }

    // 2. Text cell
    const textCellContent = [];
    // Title & subtitle group
    const hhtAVC = card.querySelector('.hhtAVC');
    if (hhtAVC) {
      const cjAQRA = hhtAVC.querySelector('.cjAQRA');
      if (cjAQRA) {
        // Heading (h3 with two spans: overline & main)
        const h3 = cjAQRA.querySelector('h3[data-test-id="section-header"]');
        if (h3) {
          textCellContent.push(h3);
        }
        // Description: inside .jVKIid or a [data-skyui-core="Markdown@11.8.1"]
        // (sometimes a span, sometimes a div)
        const descr = cjAQRA.querySelector('.jVKIid, [data-skyui-core="Markdown@11.8.1"]');
        if (descr) {
          textCellContent.push(descr);
        }
      }
    }
    // CTA Buttons (usually two)
    const iqMgqF = card.querySelector('.iqMgqF');
    if (iqMgqF) {
      const ctas = Array.from(iqMgqF.querySelectorAll('a'));
      if (ctas.length) {
        textCellContent.push(...ctas);
      }
    }
    // Defensive: If no title/desc/buttons, insert a blank div for semantic structure
    if (textCellContent.length === 0) {
      textCellContent.push(document.createElement('div'));
    }
    rows.push([imageCell, textCellContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
