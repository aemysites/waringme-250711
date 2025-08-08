/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare table header
  const cells = [['Cards (cards4)']];
  // Locate all cards: direct children <li> of the <ul>
  const cards = element.querySelectorAll('ul > li');
  cards.forEach(card => {
    // Card image is always present
    const img = card.querySelector('img');
    // Card text container holds title and description
    // Use the most nested box that contains both <p> elements
    let textBox = card.querySelector('div[data-skyui-core^="Box@"], .box__Box-sc-1i8zs0c-0');
    // Fallback: if textBox is missing, create a blank div
    if (!textBox) {
      textBox = document.createElement('div');
    }
    // Fallback: if image is missing, create a blank span
    const imageCell = img ? img : document.createElement('span');
    cells.push([
      imageCell,
      textBox
    ]);
  });
  // Replace original element with the new structured block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
