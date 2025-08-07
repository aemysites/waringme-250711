/* global WebImporter */
export default function parse(element, { document }) {
  // Header row with exact name
  const headerRow = ['Cards (cards30)'];

  // Find all top-level card items
  const cardItems = element.querySelectorAll('ul > li');

  const rows = Array.from(cardItems).map((li) => {
    // Find the image for the first cell
    const img = li.querySelector('img');
    // Find the text box which contains the title and description
    const textBox = li.querySelector('.box__Box-sc-1i8zs0c-0');
    // Defensive: Provide fallback if not found
    return [img || '', textBox || ''];
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
