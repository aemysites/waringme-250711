/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches example
  const headerRow = ['Carousel (carousel62)'];

  // Helper: Extract image element (reference the <img> in <picture>)
  function getCardImage(card) {
    const img = card.querySelector('picture img');
    return img || '';
  }

  // Helper: Extract text content (title, description, CTA links), referencing existing elements
  function getCardTextContent(card) {
    const fragments = [];
    // Promotional badge (e.g., 'New', '2025')
    const badge = card.querySelector('.sc-csKJxZ');
    if (badge && badge.textContent.trim()) {
      // Reference a <p> for badge
      const badgeP = document.createElement('p');
      badgeP.textContent = badge.textContent.trim();
      fragments.push(badgeP);
    }
    // Title (h2 as heading)
    const h2 = card.querySelector('h2');
    if (h2) {
      fragments.push(h2);
    }
    // Description paragraphs: are found in data-skyui-core="Text@11.8.0" but not inside badge or h2
    // Find all [data-skyui-core="Text@11.8.0"] inside 'intersection animator' div
    const animator = card.querySelector('[data-test-id="intersection animator"]');
    if (animator) {
      const textDivs = animator.querySelectorAll('[data-skyui-core="Text@11.8.0"]');
      textDivs.forEach(div => {
        // Only add if has text, and not empty
        const span = div.querySelector('span');
        if (span && span.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = span.textContent.trim();
          fragments.push(p);
        }
      });
    }
    // CTAs: All <a> inside the card in the container with data-test-id="card-*-cta"
    const ctaContainer = card.querySelector('[data-test-id$="cta"]');
    if (ctaContainer) {
      // All direct <a> children
      const links = Array.from(ctaContainer.querySelectorAll('a'));
      if (links.length) {
        // Wrap links in a single <p> for spacing
        const p = document.createElement('p');
        links.forEach((link, idx) => {
          p.appendChild(link);
          if (idx !== links.length - 1) {
            p.appendChild(document.createTextNode(' '));
          }
        });
        fragments.push(p);
      }
    }
    // If nothing, return empty string (so createTable doesn't receive empty array)
    return fragments.length ? fragments : '';
  }

  // All card wrappers (slide items)
  const cardWrappers = element.querySelectorAll('[data-test-id^="card-wrapper-"]');
  const rows = [headerRow];
  cardWrappers.forEach(card => {
    const img = getCardImage(card);
    const textContent = getCardTextContent(card);
    rows.push([img, textContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
