/* global WebImporter */
export default function parse(element, { document }) {
  // Header row should match exactly as per example
  const headerRow = ['Cards (cardsNoImages59)'];
  const cells = [headerRow];

  // Find grid containing cards
  const grid = element.querySelector('[data-test-id="women-in-esports-rtbs-grid"]');
  if (!grid) return;

  // Get all immediate card divs
  const cardDivs = grid.querySelectorAll(':scope > [data-test-id="rtb"]');
  cardDivs.forEach((cardDiv) => {
    // Create a fragment for each row cell and reference existing elements
    const frag = document.createDocumentFragment();
    // Reference heading if present
    const heading = cardDiv.querySelector('h3');
    if (heading) frag.appendChild(heading);
    // Reference description container if present
    const descWrap = cardDiv.querySelector('.text__TextElement-sc-qf7y4e-0.hawAvc');
    if (descWrap) {
      // Append children that are not the heading itself (already added)
      Array.from(descWrap.childNodes).forEach((node) => {
        // Skip if node is a heading already appended
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'H3') return;
        // Only append non-empty nodes
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '') return;
        frag.appendChild(node);
      });
    }
    // Only add row if there is some content
    if (frag.childNodes.length > 0) {
      cells.push([frag]);
    }
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}