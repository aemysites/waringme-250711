/* global WebImporter */
export default function parse(element, { document }) {
  // --- Header row (exactly as in example) ---
  const headerRow = ['Hero (hero6)'];

  // --- Row 2: Background image (first prominent image in visual block) ---
  let bgImg = '';
  const bgImgEl = element.querySelector('img[data-test-id="content-gallery-hero-background-image"]');
  if (bgImgEl) bgImg = bgImgEl;
  const row2 = [bgImg];

  // --- Row 3: Content (all headings, subheadings, text, call-to-action, and foreground image/text) ---
  const contentNodes = [];

  // Headings: h2 usually contains overline and heading
  const h2 = element.querySelector('h2');
  if (h2) contentNodes.push(h2);

  // Collect all unique direct descendants that are not h2 in the left column
  const leftCol = element.querySelector('.hhtAVC');
  if (leftCol) {
    // Markdown or additional description
    leftCol.querySelectorAll('[data-skyui-core="Markdown@11.8.0"], .ccuRHH, p').forEach(node => {
      // Only add if not already included (not inside h2)
      if (!h2 || !h2.contains(node)) {
        // Sometimes Markdown is wrapped, so unwrap inner node
        if (node.childElementCount === 1 && node.firstElementChild.tagName === 'DIV') {
          contentNodes.push(node.firstElementChild);
        } else {
          contentNodes.push(node);
        }
      }
    });
  }

  // Foreground image and any accompanying text
  // Often in the right column (class .egylQn or .bWkJXY)
  const rightCol = element.querySelector('.egylQn, .bWkJXY');
  if (rightCol) {
    // Add ALL images and paragraphs in this region
    rightCol.querySelectorAll('img, p').forEach(node => {
      contentNodes.push(node);
    });
  }

  // Compose row 3
  const row3 = [contentNodes.length ? contentNodes : ''];

  // Assemble table
  const cells = [
    headerRow,
    row2,
    row3
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}