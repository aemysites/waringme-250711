/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the main card from the big a at the top
  function extractCardMain(a) {
    // Find the main image
    const img = a.querySelector('img');
    // The structure is: two spans inside the Flex div with class dWHTZf
    const flex = a.querySelector('.dWHTZf');
    let title = null, desc = null;
    if (flex) {
      const spans = flex.querySelectorAll('span');
      if (spans.length > 0) title = spans[0];
      if (spans.length > 1) desc = spans[1];
    }
    // Assemble text: title as <strong>, description as <div>
    const textDiv = document.createElement('div');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent;
      textDiv.appendChild(strong);
    }
    if (desc) {
      const descDiv = document.createElement('div');
      descDiv.textContent = desc.textContent;
      textDiv.appendChild(descDiv);
    }
    return [img, textDiv];
  }

  // Helper for the cards in the right column
  function extractCardSection(a) {
    const grid = a.querySelector('.grid__Grid-sc-ysk8de-0');
    let img = null;
    let title = null;
    if (grid) {
      img = grid.querySelector('img');
      title = grid.querySelector('span');
    }
    const textDiv = document.createElement('div');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent;
      textDiv.appendChild(strong);
    }
    return [img, textDiv];
  }

  const rows = [];
  // Header row exactly as required
  rows.push(['Cards (cards18)']);

  // First card (large)
  const mainA = element.querySelector(':scope > a');
  if (mainA) {
    const mainRow = extractCardMain(mainA);
    if (mainRow[0] || mainRow[1].childNodes.length) {
      rows.push(mainRow);
    }
  }
  // Other cards
  const subDiv = element.querySelector(':scope > div');
  if (subDiv) {
    const links = subDiv.querySelectorAll(':scope > a');
    links.forEach((a) => {
      const cardRow = extractCardSection(a);
      if (cardRow[0] || cardRow[1].childNodes.length) {
        rows.push(cardRow);
      }
    });
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
