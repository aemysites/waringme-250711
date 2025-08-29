/* global WebImporter */
export default function parse(element, { document }) {
  // --- 1. Table Header ---
  const headerRow = ['Hero (hero19)'];

  // --- 2. Background Image ---
  // Look for immediate <picture> or <img> element inside the block
  let backgroundCell = '';
  const picture = element.querySelector('picture');
  if (picture) {
    backgroundCell = picture;
  } else {
    const img = element.querySelector('img');
    if (img) backgroundCell = img;
  }

  // --- 3. Textual Content (headings, paragraph, CTA) ---
  // We want all visible content except the background image
  // The main text & CTA are somewhere inside the nested hierarchies
  // We'll get the position container and extract its children
  let contentCell = '';
  // Position container: where most heading/text/cta lives
  let positionDiv = null;
  const positionCandidates = Array.from(element.querySelectorAll('[data-skyui-core^="Position"]'));
  if (positionCandidates.length) {
    positionDiv = positionCandidates[0];
  }
  // If found, we want everything except the background image
  if (positionDiv) {
    // Exclude picture/img from cell, include all child content
    // We'll put all direct children of positionDiv in the cell
    // (this block's visual layout combines headings, paragraphs, CTAs together)
    const children = Array.from(positionDiv.children);
    if (children.length) {
      contentCell = children;
    } else {
      // fallback: include positionDiv itself
      contentCell = positionDiv;
    }
  } else {
    // fallback: try to find main heading/content area
    // Sometimes heading/p/cta are not inside a specific container
    // Try to grab all headings, paragraphs, and CTAs directly
    const headEls = Array.from(element.querySelectorAll('h1, h2, h3, p, span, a'));
    if (headEls.length) {
      contentCell = headEls;
    }
  }

  // --- 4. Build table rows ---
  const rows = [
    headerRow,
    [backgroundCell],
    [contentCell]
  ];

  // --- 5. Create and replace ---
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
