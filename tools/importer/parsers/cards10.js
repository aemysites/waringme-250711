/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as required
  const headerRow = ['Cards (cards10)'];
  
  // Get all cards (direct <a> children)
  const cardLinks = Array.from(element.querySelectorAll(':scope > a'));

  const rows = cardLinks.map(card => {
    // IMAGE: The first image in the .utility-aspect-3x2 container
    const imageContainer = card.querySelector('.utility-aspect-3x2');
    let image = null;
    if (imageContainer) {
      image = imageContainer.querySelector('img');
    }

    // TEXT CONTENT: build a div referencing original DOM elements, not clones
    const textDiv = document.createElement('div');
    // Tag (optional)
    const tag = card.querySelector('.tag');
    if (tag) textDiv.appendChild(tag);
    // Title (h3)
    const heading = card.querySelector('h3, .h4-heading');
    if (heading) textDiv.appendChild(heading);
    // Description
    const para = card.querySelector('p');
    if (para) textDiv.appendChild(para);
    // CTA (not present in this HTML, but generalized code in case it appears)
    // Only include if it's not the main card-link itself
    const ctas = Array.from(card.querySelectorAll('a'))
      .filter(a => !a.classList.contains('card-link'));
    ctas.forEach(cta => textDiv.appendChild(cta));

    return [image, textDiv];
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
