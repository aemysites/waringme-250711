/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the header row exactly as the block name in the example
  const headerRow = ['Hero (hero11)'];
  
  // There is no background image in the provided HTML; only text content and a CTA
  // Extract the h1 (title)
  const h1 = element.querySelector('h1');

  // Extract subheading: search for first .text__TextElement-sc-qf7y4e-0 containing a Markdown span after h1
  let subheading = null;
  if (h1) {
    // Go up to h1's parent, then look for next siblings that might have subheading
    // But in this structure, the subheading is a .text__TextElement-sc-qf7y4e-0 UByi > span[data-skyui-core="Markdown@11.8.0"]
    const subNode = element.querySelector('.text__TextElement-sc-qf7y4e-0.UByi span[data-skyui-core="Markdown@11.8.0"]');
    if (subNode) {
      // Use its parent (the .UByi)
      subheading = subNode.parentElement;
    }
  }

  // Extract CTA: look for a[href] with data-test-id^="hero-cta"
  let cta = null;
  const ctaLink = element.querySelector('a[data-test-id^="hero-cta"]');
  if (ctaLink) {
    cta = ctaLink;
  }

  // Prepare contents for the main content cell
  // Keep structure: h1, subheading, cta, with reasonable spacing
  const contentNodes = [];
  if (h1) contentNodes.push(h1);
  if (subheading) contentNodes.push(subheading);
  if (cta) contentNodes.push(cta);

  // If all elements are missing, put an empty div for resilience
  if (contentNodes.length === 0) {
    contentNodes.push(document.createElement('div'));
  }

  // The single content cell (as an array of existing elements)
  const contentRow = [contentNodes];
  
  // Build the table array (no Section Metadata in example)
  const cells = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  
  // Replace the original element with the new block table
  element.replaceWith(block);
}
