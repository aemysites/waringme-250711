/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards37): 2 columns, header row, then one row per card
  const headerRow = ['Cards (cards37)'];

  // Helper: extract the image/icon from the card (first cell)
  function extractCardImage(cardElem) {
    // Try to find a div with a background-image style
    const bgDiv = cardElem.querySelector('[data-test-id="background-image"]');
    if (bgDiv && bgDiv.style && bgDiv.style.backgroundImage) {
      const bg = bgDiv.style.backgroundImage;
      const match = bg.match(/url\(["']?(.*?)["']?\)/);
      if (match && match[1]) {
        const img = document.createElement('img');
        img.src = match[1];
        img.alt = '';
        return img;
      }
    }
    // If not, leave empty cell
    return '';
  }

  // Helper: extract the text content (second cell), always referencing existing elements
  function extractCardText(cardElem) {
    const textElems = [];
    // Main card body
    const body = cardElem.querySelector('.sc-fHejqy');
    if (body) {
      // h3 for heading and/or overline
      const h3 = body.querySelector('h3');
      if (h3) {
        // Reference the existing h3 directly
        textElems.push(h3);
      }
      // Description
      const descSpan = body.querySelector('span[data-skyui-core^="Markdown"]');
      if (descSpan) {
        // Reference the parent .text__TextElement-sc-qf7y4e-0 for any text formatting
        const descBox = descSpan.closest('.text__TextElement-sc-qf7y4e-0') || descSpan;
        textElems.push(descBox);
      }
      // CTA (button/link)
      const cta = body.querySelector('a[data-skyui-core^="Button"]');
      if (cta) {
        textElems.push(cta);
      }
    }
    return textElems;
  }

  // All product cards (direct children of the block)
  const cards = element.querySelectorAll('[data-test-id^="product-card-"]');
  const rows = [];
  cards.forEach(cardElem => {
    const image = extractCardImage(cardElem);
    const textContent = extractCardText(cardElem);
    rows.push([image, textContent]);
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
