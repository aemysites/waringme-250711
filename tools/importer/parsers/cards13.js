/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Cards (cards13)'];
  const cells = [headerRow];

  // Find all tabpanel divs directly under the main element
  const tabpanels = Array.from(element.querySelectorAll(':scope > div[role="tabpanel"]'));

  tabpanels.forEach(tabpanel => {
    // Each tabpanel contains a ul with li for the cards
    const ul = tabpanel.querySelector('ul');
    if (!ul) return;
    const lis = Array.from(ul.children);
    lis.forEach(li => {
      // Card image
      const img = li.querySelector('img');
      // Card text content extraction
      // 1. Title: from alt, as <strong>
      // 2. Description: any non-image text content in the li
      const textContent = [];
      if (img && img.alt && img.alt.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = img.alt.trim();
        textContent.push(strong);
      }

      // Add description if present (all non-img, non-empty text nodes)
      let foundDescription = false;
      Array.from(li.childNodes).forEach(node => {
        if (node.nodeType === 3 && node.textContent.trim()) {
          // Non-empty text node
          foundDescription = true;
          textContent.push(document.createElement('br'));
          textContent.push(document.createTextNode(node.textContent.trim()));
        } else if (node.nodeType === 1 && node.tagName !== 'IMG') {
          foundDescription = true;
          textContent.push(document.createElement('br'));
          textContent.push(node);
        }
      });

      // If no description found (as in the provided HTML), just use the title
      cells.push([
        img,
        textContent.length > 1 ? textContent : textContent[0]
      ]);
    });
  });

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
