/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches the example exactly
  const headerRow = ['Cards (cards9)'];
  const cells = [headerRow];

  // Get all immediate li elements (cards)
  const items = element.querySelectorAll('ul > li');
  items.forEach((item) => {
    // Extract image (mandatory)
    const img = item.querySelector('img');

    // Extract text container
    const textContainer = item.querySelector('div[data-skyui-core^="Flex"] > div[data-skyui-core^="Flex"] > div[data-skyui-core^="Box"]');
    let title = null;
    let desc = null;
    if (textContainer) {
      const paragraphs = textContainer.querySelectorAll('p');
      // Title: first p, if present
      if (paragraphs[0]) title = paragraphs[0];
      // Description: second p, if present
      if (paragraphs[1]) desc = paragraphs[1];
    }
    // Compose text cell: always an array if both present, otherwise just what exists
    let textCell = null;
    if (title && desc) {
      textCell = [title, desc];
    } else if (title) {
      textCell = title;
    } else if (desc) {
      textCell = desc;
    } else {
      textCell = '';
    }
    // Push row: [image, text]
    cells.push([img, textCell]);
  });

  // Create table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
