/* global WebImporter */
export default function parse(element, { document }) {
  // Table header, exactly matching the example
  const headerRow = ['Cards (cards4)'];
  const cells = [headerRow];

  // Each card is a card-wrapper
  const cardWrappers = element.querySelectorAll('[data-test-id^="card-wrapper-"]');
  cardWrappers.forEach(card => {
    // --- Image cell ---
    let imgCell = null;
    const picture = card.querySelector('[data-test-id="product-card-background-image"] picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        imgCell = img;
      }
    }

    // --- Text cell ---
    const contentParts = [];

    // Badge/flag (optional)
    const badge = card.querySelector('.sc-iBdnpw');
    if (badge && badge.textContent.trim()) {
      const badgeSpan = badge.querySelector('span');
      if (badgeSpan && badgeSpan.textContent.trim()) {
        // Use a <p> for badge
        const p = document.createElement('p');
        p.append(badgeSpan);
        contentParts.push(p);
      }
    }

    // Heading (h2)
    const heading = card.querySelector('h2');
    if (heading) {
      contentParts.push(heading);
    }

    // Description(s): find all Markdown spans after heading
    // The pricing/description blocks are within two Box containers after heading
    const markdownBoxes = card.querySelectorAll('[data-skyui-core="Markdown@11.8.0"]');
    markdownBoxes.forEach(mdSpan => {
      if (mdSpan.textContent.trim()) {
        const p = document.createElement('p');
        p.innerHTML = mdSpan.innerHTML;
        contentParts.push(p);
      }
    });

    // CTA links (optional)
    const ctaWrap = card.querySelector('[data-test-id^="card-"][data-test-id$="-cta"]');
    if (ctaWrap) {
      const ctaLinks = ctaWrap.querySelectorAll('a');
      if (ctaLinks.length) {
        const p = document.createElement('p');
        ctaLinks.forEach((a, i) => {
          p.append(a);
          if (i < ctaLinks.length - 1) p.append(' ');
        });
        contentParts.push(p);
      }
    }

    // Add row: [image, textContent]
    cells.push([imgCell, contentParts]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
