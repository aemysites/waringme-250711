/* global WebImporter */
export default function parse(element, { document }) {
  // Table header, exactly matching the block name
  const headerRow = ['Carousel (carousel33)'];
  const rows = [headerRow];

  // Find the carousel slide items
  const ul = element.querySelector('ul.items__Element-sc-behb7x-0');
  if (ul) {
    const lis = ul.querySelectorAll(':scope > li');
    lis.forEach((li) => {
      // Each li contains an anchor with the main image and content
      const a = li.querySelector('a[data-test-id="hero-rail-card"]');
      if (!a) return;
      
      // Get the main slide image (the last img under the anchor)
      let mainImg = null;
      const imgs = a.querySelectorAll('img');
      if (imgs.length > 0) {
        mainImg = imgs[imgs.length - 1];
      }
      
      // Compose the text cell
      const textCell = [];
      // Heading: from VisuallyHiddenText, as <h2>
      const vh = a.querySelector('.visually-hidden-text__VisuallyHiddenText-sc-n48can-0');
      if (vh && vh.textContent.trim()) {
        const h2 = document.createElement('h2');
        h2.textContent = vh.textContent.trim();
        textCell.push(h2);
      }
      // Description paragraph
      const desc = a.querySelector('p');
      if (desc) {
        textCell.push(desc);
      }
      // Included-with label (optional)
      const included = a.querySelector('.flex__Flex-sc-1r1ee79-0.fLlvsb');
      if (included) {
        textCell.push(included);
      }
      // Call-to-action: if there is a link and it's not already reflected in the heading, add it at the bottom
      // In this structure, the whole slide is a link, but if you want to add a CTA at the bottom, you could add an <a>
      // But in the example, the CTA was part of the text cell, not every slide has a CTA beyond the heading.

      rows.push([
        mainImg,
        textCell.length > 0 ? textCell : ''
      ]);
    });
  }

  // Create and replace the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
