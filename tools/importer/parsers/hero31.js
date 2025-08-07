/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row - must match the example EXACTLY
  const headerRow = ['Hero (hero31)'];

  // Second row: background image (none in the provided HTML)
  const bgRow = [''];

  // Third row: Gather content (heading, description, CTA links)

  // Find the heading (h2 inside the block)
  const heading = element.querySelector('h2');

  // Find the paragraph/description. In this HTML, it's a span[data-skyui-core="Markdown@11.8.0"] inside a div.
  let description;
  const descSpan = element.querySelector('span[data-skyui-core="Markdown@11.8.0"]');
  if (descSpan) {
    // Use its parent container if possible (usually the full description block)
    const descContainer = descSpan.closest('div[data-skyui-core="Text@11.8.0"]');
    description = descContainer || descSpan;
  }

  // Find all CTA links
  const ctaLinks = Array.from(element.querySelectorAll('a[data-test-id="section-cta-link"]'));
  // Remove SVGs from these links for a clean link output
  ctaLinks.forEach(link => {
    Array.from(link.querySelectorAll('svg')).forEach(svg => svg.remove());
  });

  // Compose the content row
  const contentElements = [];
  if (heading) contentElements.push(heading);
  if (description) contentElements.push(description);
  if (ctaLinks.length > 0) contentElements.push(...ctaLinks);

  const contentRow = [contentElements];

  // Compose the table
  const cells = [
    headerRow,   // 1. header
    bgRow,       // 2. background image (empty)
    contentRow   // 3. content
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
