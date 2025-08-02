/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel container
  const carousel = element.querySelector('[data-skyui-core="Carousel@11.8.0"]');
  if (!carousel) return;

  // Find the track that holds the slides
  const track = carousel.querySelector('[data-testid="track"]');
  if (!track) return;

  // Get only the main, visible carousel slides (not clones)
  const slides = Array.from(track.querySelectorAll(':scope > div[data-test-id="carousel-slide"]'));
  if (slides.length === 0) return;

  // Prepare the table rows
  const rows = [['Carousel (carousel18)']];

  slides.forEach((slide) => {
    // Try to find the main <figure> in the slide
    const figure = slide.querySelector('figure');
    let imageCell = '';
    let textCell = '';

    if (figure) {
      // IMAGE CELL: publication logo image from figcaption > cite > img
      const logoImg = figure.querySelector('figcaption cite img');
      if (logoImg && logoImg.src && logoImg.src.trim() !== '') {
        imageCell = logoImg;
      } else {
        imageCell = '';
      }

      // TEXT CELL: gather blockquote + publication name + optional stars (all as references)
      const textParts = [];
      // blockquote (quote text)
      const blockquote = figure.querySelector('blockquote');
      if (blockquote) textParts.push(blockquote);
      // publication name (from figcaption, excluding cite > img)
      const figcaption = figure.querySelector('figcaption');
      if (figcaption) {
        // Create a <span> and reference all child nodes except cite>img
        const fcSpan = document.createElement('span');
        Array.from(figcaption.childNodes).forEach((node) => {
          if (node.nodeType === 1 && node.nodeName === 'CITE') {
            // Remove img from cite but keep text
            const cite = node;
            const citeText = Array.from(cite.childNodes).filter(n => !(n.nodeType === 1 && n.nodeName === 'IMG')).map(n => n.textContent).join('').trim();
            if (citeText) fcSpan.appendChild(document.createTextNode(citeText));
          } else if (node.nodeType === 3) { // text node
            if (node.textContent.trim()) fcSpan.appendChild(document.createTextNode(node.textContent.trim()));
          } else if (node.nodeType === 1 && node.nodeName !== 'CITE') {
            if (node.textContent.trim()) fcSpan.appendChild(document.createTextNode(node.textContent.trim()));
          }
        });
        if (fcSpan.textContent.trim()) textParts.push(fcSpan);
      }
      // stars (svg icons, in .flex__Flex-sc-1r1ee79-0.iTiZUK)
      const starsWrap = slide.querySelector('.flex__Flex-sc-1r1ee79-0.iTiZUK');
      if (starsWrap) textParts.push(starsWrap);
      // If somehow nothing was pushed, fallback to all text in figure
      if (textParts.length === 0) {
        const fallbackText = figure.textContent.trim();
        if (fallbackText) textParts.push(document.createTextNode(fallbackText));
      }
      // Use array or single element
      textCell = textParts.length === 1 ? textParts[0] : textParts;
    } else {
      // Fallback: all text from slide
      const fallbackText = slide.textContent.trim();
      textCell = fallbackText ? document.createTextNode(fallbackText) : '';
      imageCell = '';
    }
    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
