/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Prepare table header exactly as required
  const headerRow = ['Cards (cards13)'];

  // 2. Get all top-level card containers (immediate children)
  const cards = Array.from(element.querySelectorAll(':scope > div'));
  const rows = [headerRow];

  cards.forEach((card) => {
    // First cell: mandatory image/icon (first img in card)
    const img = card.querySelector('img');

    // Second cell: text content (title + description, keep structure)
    // Robustly select title (first <p> direct child of the right flex/box)
    let title = null;
    let desc = null;

    // Get the immediate box (contains text)
    const box = card.querySelector('div[data-skyui-core*="Box"], div[class*="box__Box"]');
    if (box) {
      const flex = box.querySelector('div[data-skyui-core*="Flex"], div[class*="flex__Flex"]');
      if (flex) {
        // First p: title (should always exist, but check)
        title = flex.querySelector('p');
        // Desc: in intersection animator > p
        const animator = flex.querySelector('[data-test-id="intersection animator"]');
        if (animator) {
          desc = animator.querySelector('p');
        }
      }
    }
    // Compose the text cell (array of elements, only if they exist)
    const textCell = [];
    if (title) textCell.push(title);
    if (desc) textCell.push(desc);
    rows.push([img, textCell]);
  });

  // 3. Create and replace the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
