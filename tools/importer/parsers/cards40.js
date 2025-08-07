/* global WebImporter */
export default function parse(element, { document }) {
  // Header as in the example
  const headerRow = ['Cards (cards40)'];
  // Find the list of cards
  const ul = element.querySelector('ul.items__Element-sc-behb7x-0');
  if (!ul) return;
  const liCards = ul.querySelectorAll(':scope > li');

  const rows = Array.from(liCards).map(li => {
    // Left cell: Card image
    let image = null;
    const link = li.querySelector('a');
    if (link) {
      // Find the first non-empty alt image
      image = Array.from(link.querySelectorAll('img')).find(img => img.getAttribute('alt') && img.getAttribute('alt').trim());
    }
    // Right cell: All text content for the card
    // On Sky, there's usually just a <span> with the label after the link in the flex container
    let textCell;
    const flex = li.querySelector('div');
    if (flex) {
      // Grab all <span> elements after the <a> (safest for future variants)
      const spans = Array.from(flex.querySelectorAll('span'));
      // If there's at least one non-empty span, use its content as a heading (strong)
      if (spans.length && spans[0].textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = spans[0].textContent.trim();
        textCell = [strong];
      } else {
        // Fallback to just text if present
        const labelText = flex.textContent.trim();
        textCell = labelText ? [document.createTextNode(labelText)] : [''];
      }
    } else {
      textCell = [''];
    }

    return [image || '', textCell];
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
