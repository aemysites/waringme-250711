/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match exactly
  const headerRow = ['Cards (cards40)'];
  const cells = [headerRow];

  // Find the list with card items
  const rail = element.querySelector('ul');
  if (!rail) return;

  rail.querySelectorAll('li').forEach((li) => {
    // IMAGE: Use the first <img> inside the first <a>
    let imageEl = null;
    const cardLink = li.querySelector('a');
    if (cardLink) {
      imageEl = cardLink.querySelector('img');
    }

    // TEXT: Gather all span, p, div and direct text nodes (not inside <a>) inside the li
    const contentElements = [];
    // If there are spans outside the <a>, treat the first as the title
    let foundTitle = false;
    li.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE && !cardLink.contains(node)) {
        if ((node.tagName === 'SPAN' || node.tagName === 'P' || node.tagName === 'DIV') && node.textContent.trim()) {
          if (!foundTitle) {
            // Add as <strong>
            const strong = document.createElement('strong');
            strong.textContent = node.textContent.trim();
            contentElements.push(strong);
            foundTitle = true;
          } else {
            // Add as <p>
            const p = document.createElement('p');
            p.textContent = node.textContent.trim();
            contentElements.push(p);
          }
        }
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        // Only add if not whitespace
        if (!foundTitle) {
          const strong = document.createElement('strong');
          strong.textContent = node.textContent.trim();
          contentElements.push(strong);
          foundTitle = true;
        } else {
          const p = document.createElement('p');
          p.textContent = node.textContent.trim();
          contentElements.push(p);
        }
      }
    });

    // Fallback: If no content found, use any <span> inside li that's not inside <a>
    if (!contentElements.length) {
      const altSpan = Array.from(li.querySelectorAll('span')).find(span => !cardLink || !cardLink.contains(span));
      if (altSpan && altSpan.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = altSpan.textContent.trim();
        contentElements.push(strong);
      }
    }

    // Edge case: In this HTML, the card title is always in a <span> after the image, but sometimes only that exists
    // To be robust: If still empty, try to use the <span> inside li (even if inside <a>)
    if (!contentElements.length) {
      const anySpan = li.querySelector('span');
      if (anySpan && anySpan.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = anySpan.textContent.trim();
        contentElements.push(strong);
      }
    }

    // Compose the row
    cells.push([
      imageEl,
      contentElements.length === 1 ? contentElements[0] : contentElements
    ]);
  });

  // Create table and replace element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
