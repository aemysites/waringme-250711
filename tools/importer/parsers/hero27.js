/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block name
  const headerRow = ['Hero (hero27)'];

  // 1. Background image (picture or img)
  let pictureEl = element.querySelector('picture');
  let imgEl = null;
  if (!pictureEl) {
    imgEl = element.querySelector('img');
  }
  // pick either the <picture> or <img> for row 2, or null if none
  const bgImageEl = pictureEl || imgEl || '';

  // 2. Content cell: collect all block text and CTAs
  // The main content is fairly deep, but always inside the main hero block
  // We'll find: subheading (p), main heading (h1), description (span[data-skyui-core="Markdown@11.8.0"]), CTAs (a)
  // We'll preserve the order and all in a single cell, using references to existing elements
  const contentItems = [];

  // Optional subheading (the p above h1)
  // Find a p that's before the h1
  let h1 = element.querySelector('h1');
  if (h1) {
    // Find the closest previous p in DOM before h1
    let pCandidates = Array.from(element.querySelectorAll('p'));
    let pSub = null;
    for (let p of pCandidates) {
      if (p.compareDocumentPosition(h1) & Node.DOCUMENT_POSITION_FOLLOWING) {
        pSub = p;
        break;
      }
    }
    if (pSub) contentItems.push(pSub);
  }

  // Main heading
  if (h1) {
    contentItems.push(h1);
  }

  // Description (span[data-skyui-core="Markdown@11.8.0"])
  // It may be inside a div, so we grab the parent
  let descSpan = element.querySelector('span[data-skyui-core="Markdown@11.8.0"]');
  if (descSpan) {
    let descContainer = descSpan.closest('.text__TextElement-sc-qf7y4e-0, div, p') || descSpan;
    // Only add if not already included
    if (!contentItems.includes(descContainer) && !contentItems.includes(descSpan)) {
      contentItems.push(descContainer);
    }
  }

  // CTAs: all <a> within [data-test-id="hero-cta"]
  const ctaContainer = element.querySelector('[data-test-id="hero-cta"]');
  if (ctaContainer) {
    // Create a div to group CTAs
    const ctaDiv = document.createElement('div');
    Array.from(ctaContainer.querySelectorAll('a')).forEach(a => ctaDiv.appendChild(a));
    // Only add if there is at least one CTA
    if (ctaDiv.childNodes.length > 0) {
      contentItems.push(ctaDiv);
    }
  }

  // Prepare the content cell
  let contentCell;
  if (contentItems.length === 1) {
    contentCell = contentItems[0];
  } else if (contentItems.length > 1) {
    // wrap in div for block
    contentCell = document.createElement('div');
    contentItems.forEach(item => contentCell.appendChild(item));
  } else {
    contentCell = '';
  }

  // Compose the table: 1 column, 3 rows
  const rows = [
    headerRow,
    [bgImageEl],
    [contentCell],
  ];

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
