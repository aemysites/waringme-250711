/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches example format exactly
  const cells = [['Cards (cards25)']];

  // Locate card list
  const list = element.querySelector('ul');
  if (list) {
    list.querySelectorAll(':scope > li').forEach((li) => {
      // Get image: first <img> in card, referencing the real element
      const cardImage = li.querySelector('img');

      // Build text cell: gather all heading & paragraph content within the card, maintaining order & meaning
      const textEls = [];
      // Find all elements typically used for text in the card, in DOM order
      li.querySelectorAll('h1,h2,h3,h4,h5,h6,p,span').forEach((el) => {
        // Only include if contains any trimmed text
        if (el.textContent && el.textContent.trim().length > 0) {
          textEls.push(el);
        }
      });
      // If no heading/paragraph, fallback: get text from link itself
      if (textEls.length === 0) {
        const cardLink = li.querySelector('a');
        if (cardLink && cardLink.textContent.trim().length > 0) {
          textEls.push(cardLink);
        }
      }
      // Wrap textEls in a link if card is a link
      const cardLink = li.querySelector('a');
      let textContent;
      if (cardLink && cardLink.href) {
        // Use original link (not a clone), but clear children and append textEls
        const link = cardLink;
        // Remove all children
        while (link.firstChild) link.removeChild(link.firstChild);
        textEls.forEach(el => link.appendChild(el));
        textContent = link;
      } else {
        textContent = textEls;
      }
      cells.push([cardImage, textContent]);
    });
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
