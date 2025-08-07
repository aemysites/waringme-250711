/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per spec
  const headerRow = ['Hero (hero51)'];

  // 2nd row: background image (optional)
  // Find <picture> (preferred) or <img> only at top level for background image
  let imageCell = null;
  const topDivs = element.querySelectorAll(':scope > div, :scope > picture, :scope > img');
  let foundImage = null;
  for (let div of topDivs) {
    if (div.tagName === 'PICTURE' || div.tagName === 'IMG') {
      foundImage = div;
      break;
    }
    // If <picture> inside a top-level <div>
    const pic = div.querySelector(':scope > picture');
    if (pic) {
      foundImage = pic;
      break;
    }
    const img = div.querySelector(':scope > img');
    if (img) {
      foundImage = img;
      break;
    }
  }
  if (foundImage) {
    imageCell = foundImage;
  } else {
    // fallback: first picture or img in block
    const p = element.querySelector('picture, img');
    if (p) imageCell = p;
  }

  // 3rd row: main content (headings, subheadings, paragraph, CTA)
  // This is visually the content overlay (all text and CTA over image)
  // We'll select the element that contains the <h1> (main heading)
  let contentCell = null;
  // Try to find the content overlay by looking for an h1 in the block
  const h1 = element.querySelector('h1');
  if (h1) {
    // Climb up to its highest ancestor within the hero block, but below the main element
    let node = h1.parentElement;
    let lastContent = h1;
    while(node && node !== element) {
      lastContent = node;
      node = node.parentElement;
    }
    contentCell = lastContent;
  } else {
    // Fallback: find first element with text and links/buttons
    // This could be a flex/box with a paragraph and a link
    let candidate = null;
    // Look for divs with a or p inside
    const divs = element.querySelectorAll('div');
    divs.forEach(div => {
      if (div.querySelector('a, p, h2, h3, h4')) {
        if (!candidate || div.textContent.length > candidate.textContent.length) candidate = div;
      }
    });
    if (candidate) contentCell = candidate;
  }

  // fallback: whole element if above fails
  if (!contentCell) contentCell = element;

  // Build the table as 1 column, 3 rows
  const cells = [
    headerRow,
    [imageCell],
    [contentCell],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
