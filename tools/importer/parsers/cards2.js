/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards2) table construction
  const headerRow = ['Cards (cards2)'];
  const cells = [headerRow];

  // Find the grid that contains card blocks
  const grid = element.querySelector('.grid-layout');
  if (!grid) {
    // Fallback: if for some reason the grid is missing, do not replace
    return;
  }

  // --- 1. Main Feature Card (first <a> in grid) ---
  const allLinks = grid.querySelectorAll('a.utility-link-content-block');
  // The HTML structure suggests the first <a> is the large feature card
  if (allLinks[0]) {
    const card = allLinks[0];
    // Image (first <img> descendant)
    const image = card.querySelector('img');
    // Tag(s)
    const tagGroup = card.querySelector('.tag-group');
    // Heading and Description
    const heading = card.querySelector('h3');
    const desc = card.querySelector('p');
    // Compose text cell, referencing existing elements in proper order
    const textCell = [];
    if (tagGroup) textCell.push(tagGroup);
    if (heading) textCell.push(heading);
    if (desc) textCell.push(desc);
    cells.push([
      image ? image : '',
      textCell
    ]);
  }

  // --- 2. Next two cards with images (they are the next two links, both with images) ---
  // Based on the HTML structure, these are allLinks[1] and allLinks[2]
  for (let i = 1; i <= 2; i++) {
    const card = allLinks[i];
    if (!card) continue;
    const image = card.querySelector('img');
    const tagGroup = card.querySelector('.tag-group');
    const heading = card.querySelector('h3');
    const desc = card.querySelector('p');
    const textCell = [];
    if (tagGroup) textCell.push(tagGroup);
    if (heading) textCell.push(heading);
    if (desc) textCell.push(desc);
    cells.push([
      image ? image : '',
      textCell
    ]);
  }

  // --- 3. Cards without images (right column group) ---
  // These are all inside the next flex-horizontal/flex-vertical block (dividers between)
  const rightColumnGroup = grid.querySelector('div.flex-horizontal.flex-vertical.flex-gap-sm:last-of-type');
  if (rightColumnGroup) {
    const links = rightColumnGroup.querySelectorAll('a.utility-link-content-block');
    links.forEach(card => {
      const heading = card.querySelector('h3');
      const desc = card.querySelector('p');
      const textCell = [];
      if (heading) textCell.push(heading);
      if (desc) textCell.push(desc);
      cells.push([
        '',
        textCell
      ]);
    });
  }

  // Create the cards block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
