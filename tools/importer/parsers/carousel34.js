/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get first image inside a slide, prefer the big one
  function getMainImage(link) {
    // .sc-iuOOrT contains main image (first img)
    const imgContainer = link.querySelector('.sc-iuOOrT');
    if (!imgContainer) return link.querySelector('img');
    // Get the first <img> that is not a logo (not smallest)
    const imgs = imgContainer.querySelectorAll('img');
    if (imgs.length === 1) return imgs[0];
    // Prefer the first child image (usually the main)
    for (const img of imgs) {
      if (img.parentElement === imgContainer) return img;
    }
    // Fallback: first image
    return imgs[0] || link.querySelector('img');
  }

  // Compose header row
  const headerRow = ['Carousel (carousel34)'];
  const rows = [];

  // Find slides: ul > li
  const ul = element.querySelector('ul');
  if (!ul) return;
  const slides = Array.from(ul.children).filter(li => li.tagName === 'LI');

  slides.forEach((li) => {
    // Each slide is an <li> containing an <a>
    const link = li.querySelector('a[data-test-id="carousel-card"]');
    if (!link) return;
    // First cell: main image (reference original element!)
    const mainImg = getMainImage(link);
    const imgCell = mainImg ? [mainImg] : [''];

    // Second cell: All text content (title, desc, etc) -- keep all blocks and structure
    const footer = link.querySelector('[data-test-id="slide-footer-default"]');
    let textCellContent = [];
    if (footer) {
      // Preserve heading and all other content in order. Reference real elements.
      const children = Array.from(footer.childNodes).filter(n => {
        // Only keep nodes that have text or are meaningful elements
        if (n.nodeType === 1 && n.textContent.trim()) return true;
        if (n.nodeType === 3 && n.textContent.trim()) return true;
        return false;
      });
      children.forEach((node) => {
        if (node.nodeType === 1) {
          textCellContent.push(node);
        } else if (node.nodeType === 3) {
          // wrap in div for safety
          const div = document.createElement('div');
          div.textContent = node.textContent;
          textCellContent.push(div);
        }
      });
      // Optionally add a CTA link (always at the end)
      if (link.href) {
        const cta = document.createElement('a');
        cta.href = link.href;
        cta.textContent = 'Find out more';
        textCellContent.push(cta);
      }
    }
    // If nothing, at least empty string
    if (!textCellContent.length) textCellContent = [''];
    rows.push([imgCell, textCellContent]);
  });

  const tableCells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
