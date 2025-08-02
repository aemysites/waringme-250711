/* global WebImporter */
export default function parse(element, { document }) {
  // Find the unordered list (ul) that represents the columns
  const ul = element.querySelector('ul');
  if (!ul) return;
  const lis = Array.from(ul.children).filter(li => li.tagName === 'LI');
  // For each li, extract its main vertical stack (image, heading, description)
  const columns = lis.map(li => {
    // Use the direct Box > intersection animator > Grid
    const box = li.querySelector('[data-skyui-core^="Box"]');
    if (!box) return li;
    const intersection = box.querySelector('[data-test-id="intersection animator"]');
    if (!intersection) return box;
    const grid = intersection.querySelector('[data-skyui-core^="Grid"]');
    if (!grid) return intersection;

    // Extract elements in order: image, heading, desc (all are direct children of grid)
    const img = grid.querySelector('img');
    const heading = grid.querySelector('p');
    let descP = null;
    // There may be a div with a p in it after the heading for the description
    const divs = grid.querySelectorAll('div');
    for (const div of divs) {
      const p = div.querySelector('p');
      if (p) {
        descP = p;
        break;
      }
    }
    // Compose the stack in a single div, referencing originals
    const colDiv = document.createElement('div');
    if (img) colDiv.appendChild(img);
    if (heading) colDiv.appendChild(heading);
    if (descP) colDiv.appendChild(descP);
    return colDiv;
  });

  // The header row should have a single cell (matching the example)
  const headerRow = ['Columns (columns27)'];
  // The next row contains as many columns as found
  const cells = [headerRow, columns];

  // Use createTable to create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Fix the header row to have one cell with colspan equal to the number of columns
  // (WebImporter.DOMUtils.createTable does not support colspan directly,
  // so we need to set it after creation)
  const headerTr = table.querySelector('tr');
  if (headerTr) {
    const ths = headerTr.querySelectorAll('th');
    if (ths.length === 1 && columns.length > 1) {
      ths[0].setAttribute('colspan', columns.length);
    }
  }

  element.replaceWith(table);
}
