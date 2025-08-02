/* global WebImporter */
export default function parse(element, { document }) {
  // The overall structure is a two-column layout:
  // Left: Heading, steps for each device, and CTAs (buttons)
  // Right: discovery+ logo image
  // 1. Find the relevant left and right columns
  const grid = element.querySelector('[data-skyui-core="Grid@11.7.1"]');
  let leftCol, rightCol;
  if (grid) {
    const gridChildren = grid.querySelectorAll(':scope > div');
    if (gridChildren.length >= 2) {
      leftCol = gridChildren[0];
      rightCol = gridChildren[1];
    }
  }
  // Fallbacks
  if (!leftCol) {
    leftCol = element.querySelector('h2')?.parentElement || element.firstElementChild;
  }
  if (!rightCol) {
    rightCol = element.querySelector('img');
  }
  // 2. Compose the left column content
  // We want: h2, then the content with steps for each device, then the CTAs (buttons)
  const leftColContent = document.createElement('div');
  // Heading
  const h2 = leftCol.querySelector('h2');
  if (h2) leftColContent.appendChild(h2);
  // Steps (the markdown block with device names and steps)
  const infoBox = leftCol.querySelector('[data-skyui-core="Markdown@11.7.1"]');
  if (infoBox) leftColContent.appendChild(infoBox);
  // CTAs (buttons)
  const ctas = leftCol.querySelector('[data-test-id="show.how-to-watch.ctas"]');
  if (ctas) leftColContent.appendChild(ctas);
  // 3. Compose the right column content (the discovery+ logo image)
  let rightColContent = null;
  if (rightCol) {
    const img = rightCol.querySelector('img') || (rightCol.tagName === 'IMG' ? rightCol : null);
    if (img) {
      rightColContent = img;
    } else {
      // If nothing else, use the full rightCol
      rightColContent = rightCol;
    }
  }
  // 4. Build the table block
  const header = ['Columns (columns10)'];
  const row = [leftColContent, rightColContent];
  // Only include rightColContent if it exists, else just one cell
  const table = WebImporter.DOMUtils.createTable(
    [header, row],
    document
  );
  // Replace the element with the new block table
  element.replaceWith(table);
}
