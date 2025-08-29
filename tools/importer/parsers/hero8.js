/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: block name
  const headerRow = ['Hero (hero8)'];

  // 2. Background image row: none present in the HTML, so empty string
  const bgRow = [''];

  // 3. Content row: heading (h2), subheading (not present), and CTA button (if present)
  // We'll reference the heading (h2), and the CTA button as a link

  // Find heading
  const heading = element.querySelector('h2');

  // Find CTA button, convert to a link (with text and icon if present)
  let ctaEl = null;
  const button = element.querySelector('button');
  if (button) {
    // Create a <span> to hold the button's contents (text + icon)
    const ctaSpan = document.createElement('span');
    // Copy button's child nodes (text and svg)
    button.childNodes.forEach(node => {
      ctaSpan.appendChild(node.cloneNode(true));
    });
    // Create CTA link
    const ctaLink = document.createElement('a');
    ctaLink.href = button.getAttribute('data-href') || '#'; // Use '#' if no actual href
    ctaLink.appendChild(ctaSpan);
    ctaEl = ctaLink;
  }

  // Compose content cell, referencing existing elements
  const contentArr = [];
  if (heading) contentArr.push(heading);
  if (ctaEl) {
    if (heading) {
      contentArr.push(document.createElement('br'));
      contentArr.push(document.createElement('br'));
    }
    contentArr.push(ctaEl);
  }
  if (!heading && !ctaEl) {
    contentArr.push('');
  }

  const contentRow = [contentArr.length > 1 ? contentArr : (contentArr[0] || '')];

  // Build final table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
