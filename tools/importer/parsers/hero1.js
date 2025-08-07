/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row, must match example
  const headerRow = ['Hero (hero1)'];

  // 1st content row: prominent image (background in example, logo in given HTML if no bg)
  // Try to find the image in the structure:
  // h1 > div > img
  let imageEl = null;
  const h1 = element.querySelector('h1');
  if (h1) {
    // The logo image is nested inside the first div inside h1
    const divInH1 = h1.querySelector('div');
    if (divInH1) {
      imageEl = divInH1.querySelector('img');
    }
  }
  const imageRow = [imageEl || ''];

  // 2nd content row: heading and subheading
  // Title is in the span in h1
  let headingFragment = [];
  if (h1) {
    // Keep the span as is (for styling/semantics), if present
    const span = h1.querySelector('span');
    if (span) headingFragment.push(span);
  }
  const contentRow = [headingFragment];

  // assemble the table
  const rows = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
