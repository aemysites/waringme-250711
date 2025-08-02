/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;
  // Header row matches exactly
  const cells = [['Carousel (carousel14)']];

  // Get all slides <li>
  const ul = element.querySelector('ul');
  if (!ul) return;
  const lis = Array.from(ul.children).filter(li => li.tagName === 'LI');

  lis.forEach(li => {
    // Find the main image (first <img> not inside .sc-ckdEwu)
    let imageEl = null;
    const imgs = Array.from(li.querySelectorAll('img'));
    imageEl = imgs.find(img => !img.closest('.sc-ckdEwu'));

    // Gather text content from footer, preserve all content
    const footer = li.querySelector('[data-test-id="slide-footer-default"]');
    let contentEls = [];
    if (footer) {
      // Move all direct children to ensure all text is included
      contentEls = Array.from(footer.children);
    }

    // Add CTA link at the bottom if the card link is present and not already in content
    const a = li.querySelector('a[data-test-id="carousel-card"]');
    if (a && a.href) {
      const alreadyHasLink = contentEls.some(node => {
        if (node.querySelector) {
          return node.querySelector('a');
        }
        return false;
      });
      if (!alreadyHasLink) {
        const ctaP = document.createElement('p');
        const ctaA = document.createElement('a');
        ctaA.href = a.href;
        // Use a short label from the first text node if possible
        let label = '';
        // Try <p> or <h3> nodes in order
        for (const node of contentEls) {
          if (node && node.textContent && node.textContent.trim()) {
            label = node.textContent.trim();
            break;
          }
        }
        if (!label) label = 'Learn more';
        ctaA.textContent = label;
        ctaP.appendChild(ctaA);
        contentEls.push(ctaP);
      }
    }

    // Add to table if image or content exists
    if (imageEl || contentEls.length > 0) {
      cells.push([
        imageEl,
        contentEls.length > 0 ? contentEls : ''
      ]);
    }
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
