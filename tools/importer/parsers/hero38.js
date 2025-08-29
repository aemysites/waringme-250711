/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name, as per example
  const headerRow = ['Hero (hero38)'];

  // Second row: Background image (none present in provided HTML)
  // If none exists, use empty string in cell
  const backgroundRow = [''];

  // Third row: Title, subheading, info, CTA, as per example
  // Extract headline (first flex row - first span)
  // Sub-heading (first flex row - second span)
  // Info block (next span)
  // CTA group (second flex row)
  const flexDivs = element.querySelectorAll(':scope > div');
  let titleBlock = null;
  let subtitleBlock = null;
  let infoBlock = null;
  let ctaGroup = null;

  // First flex: headline and subtitle
  if (flexDivs.length > 0) {
    const flex1 = flexDivs[0];
    const spans = flex1.querySelectorAll(':scope > span');
    if (spans.length > 0) {
      titleBlock = spans[0]; // Headline (contains markdown span)
    }
    if (spans.length > 1) {
      subtitleBlock = spans[1]; // Subheading
    }
  }

  // Info block is the next span after the first flex container
  const infoSpan = element.querySelector('span[data-test-id="subscription-block-body"]');
  if (infoSpan) {
    infoBlock = infoSpan;
  }

  // CTA group is the next flex div after info
  if (flexDivs.length > 1) {
    ctaGroup = flexDivs[1];
  }

  // Compose all content elements into a single cell as per example
  const contentCell = [];
  if (titleBlock) contentCell.push(titleBlock);
  if (subtitleBlock) contentCell.push(subtitleBlock);
  if (infoBlock) contentCell.push(infoBlock);
  if (ctaGroup) contentCell.push(ctaGroup);

  // Guarantee at least empty string if nothing found
  const thirdRow = [contentCell.length ? contentCell : ['']];

  // Build table
  const cells = [headerRow, backgroundRow, thirdRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
