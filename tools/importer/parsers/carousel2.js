/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get meaningful text from spans in order, keeps all text
  function getTextElements(slide) {
    const textSpans = slide.querySelectorAll('span');
    const textEls = [];
    textSpans.forEach((span, i) => {
      if (span.textContent && span.textContent.trim()) {
        if (i === 0) {
          const h3 = document.createElement('h3');
          h3.textContent = span.textContent.trim();
          textEls.push(h3);
        } else {
          const p = document.createElement('p');
          p.textContent = span.textContent.trim();
          textEls.push(p);
        }
      }
    });
    return textEls;
  }

  const rows = [['Carousel (carousel2)']];
  const ul = element.querySelector('ul.items__Element-sc-behb7x-0');
  if (!ul) return;
  const slides = ul.querySelectorAll(':scope > li');

  slides.forEach((slide) => {
    // Find anchor with images
    const anchor = slide.querySelector('a');
    let imgCell = '';
    if (anchor) {
      // Pick first meaningful img (has alt text and main image class)
      const imgs = anchor.querySelectorAll('img');
      let mainImg = null;
      for (const img of imgs) {
        if (
          img.alt && img.alt.trim() &&
          img.classList.contains('image__Image-sc-21rhmd-0')
        ) {
          mainImg = img;
          break;
        }
      }
      // Fallback: first img if none matched
      if (!mainImg && imgs.length) mainImg = imgs[0];
      imgCell = mainImg;
    }

    // Gather all text content as per the example (title, description, etc)
    let textCellContent = getTextElements(slide);
    // If the anchor itself has additional text and is not already included, treat as CTA
    if (
      anchor && anchor.textContent && anchor.textContent.trim() &&
      !textCellContent.some((el) => el.textContent === anchor.textContent.trim())
    ) {
      const a = document.createElement('a');
      a.href = anchor.href;
      a.textContent = anchor.textContent.trim();
      textCellContent.push(a);
    }
    // If no text content collected, leave blank, else pass as array
    const textCell = textCellContent.length ? textCellContent : '';
    rows.push([imgCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
