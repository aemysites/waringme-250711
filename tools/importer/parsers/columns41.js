/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header matches the block name from the example
  const headerRow = ['Columns (columns41)'];

  // 2. Find the main flex row that contains two columns
  // section > div.container > div.flex (main row) > div.flex (inner, two columns)
  const flexContainer = element.querySelector(':scope > div > div > div');
  if (!flexContainer) return;
  const columns = Array.from(flexContainer.querySelectorAll(':scope > div'));
  // Defensive: ensure we have at least 2 columns
  if (columns.length < 2) return;

  // 3. First column: image (preserve existing img element)
  const firstImg = columns[0].querySelector('img');
  // If no image, leave the cell empty
  const firstColContent = firstImg || '';

  // 4. Second column: all text, icons, CTA, price info
  // Grab everything in the second column <div>
  const secondColContent = columns[1];

  // 5. Construct the table as two columns in the second row
  const cells = [
    headerRow,
    [firstColContent, secondColContent]
  ];

  // 6. Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 7. Replace the original element
  element.replaceWith(block);
}
