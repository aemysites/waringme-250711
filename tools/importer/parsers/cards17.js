/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match the example exactly
  const cells = [['Cards (cards17)']];

  // Find the root <ul> containing cards
  const ul = element.querySelector('ul');
  if (!ul) return;

  // For each card <li>
  ul.querySelectorAll(':scope > li').forEach((li) => {
    // Card image
    const img = li.querySelector('img');
    
    // Card text block: title (h3), description (p), CTA (link)
    const h3 = li.querySelector('h3');
    const p = li.querySelector('p');
    const a = li.querySelector('a');

    // Compose the text block as an array
    const textBlock = [];
    if (h3 && h3.textContent.trim()) {
      const heading = document.createElement('strong');
      if (a && a.href) {
        const link = document.createElement('a');
        link.href = a.href;
        link.textContent = h3.textContent.trim();
        heading.appendChild(link);
      } else {
        heading.textContent = h3.textContent.trim();
      }
      textBlock.push(heading);
    }
    // If description exists (non-empty p)
    if (p && p.textContent.trim()) {
      // Add line break between title and description if needed
      if (textBlock.length > 0) {
        textBlock.push(document.createElement('br'));
      }
      textBlock.push(document.createTextNode(p.textContent.trim()));
    }

    // Add the card row to the table
    cells.push([
      img || '',
      textBlock.length === 1 ? textBlock[0] : textBlock
    ]);
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
