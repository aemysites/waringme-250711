/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel container
  const carouselContainer = element.querySelector('[data-skyui-core="Carousel@11.8.0"]');
  if (!carouselContainer) return;

  // Find the carousel slide track
  const track = carouselContainer.querySelector('[data-testid="track"]');
  if (!track) return;

  // Only select the visible carousel slides (not the clones)
  const mainSlides = Array.from(track.querySelectorAll('[data-test-id="carousel-slide"]'));
  if (mainSlides.length === 0) return;

  // Build the block table rows
  const rows = [];
  rows.push(['Carousel (carousel32)']); // Header row exactly as example

  mainSlides.forEach((slide) => {
    // First cell: logo image (if present)
    let imgCell = '';
    const logoImg = slide.querySelector('figure img[src]');
    if (logoImg && logoImg.getAttribute('src')) {
      imgCell = logoImg;
    }

    // Second cell: blockquote text + publication + star rating, keep all source content
    let textCell = [];
    const figure = slide.querySelector('figure');
    if (figure) {
      // Include blockquote with its formatting
      const blockquote = figure.querySelector('blockquote');
      if (blockquote) {
        textCell.push(blockquote);
      }
      // Publication - get everything in figcaption except <cite> and <img>
      const figcaption = figure.querySelector('figcaption');
      if (figcaption) {
        // Remove cite and image for text output; keep dash and publication name
        const pubSpan = document.createElement('span');
        Array.from(figcaption.childNodes).forEach((node) => {
          if (
            node.nodeType === Node.TEXT_NODE ||
            (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'CITE' && node.tagName !== 'IMG')
          ) {
            pubSpan.appendChild(node.cloneNode(true));
          }
        });
        const pubText = pubSpan.textContent.trim();
        if (pubText) {
          const pubDiv = document.createElement('div');
          pubDiv.textContent = pubText;
          textCell.push(pubDiv);
        }
      }
      // Star rating (SVGs) - next sibling after figcaption, if present
      if (figcaption && figcaption.nextElementSibling && figcaption.nextElementSibling.querySelectorAll('svg').length > 0) {
        textCell.push(figcaption.nextElementSibling);
      }
    }

    // If textCell is still empty, fallback to all visible text in the slide
    if (textCell.length === 0) {
      const fallbackText = slide.textContent.trim();
      if (fallbackText) {
        const p = document.createElement('p');
        p.textContent = fallbackText;
        textCell.push(p);
      }
    }

    // Table row matches the structure: [image cell, text content cell]
    rows.push([
      imgCell ? imgCell : '',
      textCell.length > 0 ? textCell : ''
    ]);
  });

  // Create and insert the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
