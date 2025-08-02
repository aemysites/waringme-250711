/* global WebImporter */
export default function parse(element, { document }) {
  // Gather immediate children
  const children = Array.from(element.querySelectorAll(':scope > *'));
  let imgEl = null;
  let headingEl = null;
  // Extract image and heading if present
  for (const child of children) {
    if (!imgEl && child.tagName.toLowerCase() === 'img') imgEl = child;
    else if (!headingEl && /^h[1-6]$/i.test(child.tagName)) headingEl = child;
  }

  // Prepare rows as per the block specs
  const rows = [
    ['Hero (hero20)'],
    [imgEl ? imgEl : ''],
    [headingEl ? headingEl : ''],
  ];
  
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
