/* global WebImporter */
export default function parse(element, { document }) {
  // Header row (must exactly match)
  const headerRow = ['Hero (hero19)'];

  // Row 2: Background Image (optional)
  let bgImg = null;
  // Look for the visually prominent background image (in .Hero__MaskBox-sc-f6nat5-1)
  const maskBox = element.querySelector('.Hero__MaskBox-sc-f6nat5-1');
  if (maskBox) {
    // Only take the first image inside the mask box as background
    bgImg = maskBox.querySelector('img');
  }

  // Row 3: Content (all hero text, CTA, logo, subheading, description)
  // Reference original elements instead of cloning
  const contentElements = [];
  // Main content container
  const contentBox = element.querySelector('.bMVJpf');
  if (contentBox) {
    // 1. Logo/image (if present, not the background one)
    // - this image is before the heading and has an empty alt
    const logoImg = contentBox.querySelector('img');
    if (logoImg) {
      contentElements.push(logoImg);
    }

    // 2. Title (h1)
    const h1 = contentBox.querySelector('h1');
    if (h1) {
      contentElements.push(h1);
    }

    // 3. Subheading (h2)
    const h2 = contentBox.querySelector('h2');
    if (h2) {
      contentElements.push(h2);
    }

    // 4. Call-to-action(s)
    // Buttons/links inside [data-test-id="show.hero.ctas"]
    const ctas = contentBox.querySelector('[data-test-id="show.hero.ctas"]');
    if (ctas) {
      // Put all CTA links in order
      const links = Array.from(ctas.querySelectorAll('a'));
      links.forEach(link => contentElements.push(link));
    }

    // 5. Description (strong inside span)
    const strongSpan = contentBox.querySelector('span > strong');
    if (strongSpan) {
      // Keep original strong element and wrap in a <p> for semantic meaning
      // Reference the parent span, as it may contain more styling
      const descSpan = strongSpan.parentElement;
      if (descSpan) {
        contentElements.push(descSpan);
      } else {
        contentElements.push(strongSpan);
      }
    }
  }

  // Compose the table rows as per block requirements
  const rows = [
    headerRow,
    [bgImg ? bgImg : ''],
    [contentElements]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
