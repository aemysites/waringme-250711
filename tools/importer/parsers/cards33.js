/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly matching the example
  const headerRow = ['Cards (cards33)'];
  const rows = [];

  // Utility: extract all content nodes (spans, text, not images) from a container
  function collectTextContent(container) {
    const textCell = [];
    let firstSpanUsed = false;
    Array.from(container.childNodes).forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'SPAN') {
          if (!firstSpanUsed) {
            const strong = document.createElement('strong');
            strong.textContent = node.textContent;
            textCell.push(strong);
            firstSpanUsed = true;
          } else {
            textCell.push(document.createElement('br'));
            textCell.push(document.createTextNode(node.textContent));
          }
        } else if (node.tagName !== 'IMG') {
          // Recursively collect from other elements (e.g. <div>, <p>)
          textCell.push(...collectTextContent(node));
        }
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        textCell.push(document.createTextNode(node.textContent.trim()));
      }
    });
    return textCell;
  }

  // Helper to parse <a> (card anchor), image, and relevant text
  function parseCard(a) {
    const img = a.querySelector('img');
    // Try to find the most likely text container among direct flex/grid divs
    let textContainer = null;
    // Prefer grid or flex divs inside a (ignoring any that only hold the image)
    const divs = a.querySelectorAll('div');
    for (const div of divs) {
      const hasSpan = div.querySelector('span');
      const hasImg = div.querySelector('img');
      if (hasSpan && !hasImg) {
        textContainer = div;
        break;
      }
    }
    // If not found, fallback: grid or flex that has both span and img
    if (!textContainer) {
      for (const div of divs) {
        if (div.querySelector('span') && div.querySelector('img')) {
          textContainer = div;
          break;
        }
      }
    }
    // If still nothing, fallback to <a> itself
    if (!textContainer) textContainer = a;

    const textCell = collectTextContent(textContainer);

    // Add CTA link if href present, always after other text
    if (a.href) {
      textCell.push(document.createElement('br'));
      // Reference the same anchor for block resilience
      const cta = a;
      // Use heading as link text if present
      const span = textContainer.querySelector('span');
      cta.textContent = span ? span.textContent : (img && img.alt ? img.alt : a.textContent.trim());
      textCell.push(cta);
    }
    rows.push([img || '', textCell]);
  }

  // Main hero card (first direct <a>)
  const directAnchors = Array.from(element.children).filter(e => e.tagName === 'A');
  if (directAnchors[0]) parseCard(directAnchors[0]);

  // Sub-cards
  const subCardsContainer = Array.from(element.children).find(e => (e.className || '').includes('ejowPs'));
  if (subCardsContainer) {
    subCardsContainer.querySelectorAll('a').forEach(parseCard);
  }

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
