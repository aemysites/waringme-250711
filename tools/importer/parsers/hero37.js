/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per requirements
  const headerRow = ['Hero (hero37)'];

  // Row for background image (none present in this HTML)
  const bgRow = [''];

  // Row for main content (headline, subheading, description, CTA)
  const contentNodes = [];

  // Get the first flex (headline & subheading)
  const flexDivs = element.querySelectorAll(':scope > div');
  if (flexDivs.length > 0) {
    const firstFlex = flexDivs[0];
    // Get all direct span children (headline, subheading)
    const spans = firstFlex.querySelectorAll(':scope > span');
    spans.forEach((span) => contentNodes.push(span));
  }

  // Paragraph/description below headline
  const textSpan = element.querySelector(':scope > span[data-test-id="subscription-block-body"]');
  if (textSpan) {
    // There is a <div> inside with description and strong tags
    const innerDiv = textSpan.querySelector('div[data-skyui-core="Markdown@11.8.0"]');
    if (innerDiv) {
      contentNodes.push(innerDiv);
    } else {
      contentNodes.push(textSpan);
    }
  }

  // CTA buttons block (second flex)
  if (flexDivs.length > 1) {
    const ctaFlex = flexDivs[1];
    // Primary button
    const ctaLink = ctaFlex.querySelector('a[data-test-id="price-cta"]');
    if (ctaLink) {
      contentNodes.push(ctaLink);
    }
    // Secondary CTA ("Already have Netflix?")
    const alreadyBtn = ctaFlex.querySelector('button[data-test-id="bullets-modal-cta"]');
    if (alreadyBtn) {
      contentNodes.push(alreadyBtn);
    }
  }

  // Compose and replace
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgRow,
    [contentNodes]
  ], document);

  element.replaceWith(table);
}
