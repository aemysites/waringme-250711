/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const cells = [['Carousel (carousel35)']];

  // Find carousel slides container (ul > li)
  const ul = element.querySelector('ul');
  if (!ul) return;
  const lis = ul.querySelectorAll(':scope > li');

  lis.forEach((li) => {
    // Get anchor and main image
    const a = li.querySelector('a');
    let mainImg = null;
    const imgContainer = li.querySelector('.sc-iKOmoZ');
    if (imgContainer) {
      const imgs = imgContainer.querySelectorAll('img');
      if (imgs.length > 0) mainImg = imgs[0];
    }

    // Compose text cell content (title, description, CTA)
    let textCell = '';
    const footer = li.querySelector('[data-test-id="slide-footer-default"]');
    if (footer) {
      const textBlock = document.createElement('div');
      // Title as h2 (from <p>)
      const pTitle = footer.querySelector('p');
      if (pTitle && pTitle.textContent.trim()) {
        const h2 = document.createElement('h2');
        h2.textContent = pTitle.textContent.trim();
        textBlock.appendChild(h2);
      }
      // Description as <p> (from <h3>)
      const h3Desc = footer.querySelector('h3');
      if (h3Desc && h3Desc.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = h3Desc.textContent.trim();
        textBlock.appendChild(p);
      }
      // CTA link: only if anchor exists and is not empty (use anchor href, text 'Learn more')
      if (a && a.href) {
        const cta = document.createElement('a');
        cta.href = a.href;
        cta.textContent = 'Learn more';
        cta.target = '_blank';
        textBlock.appendChild(cta);
      }
      textCell = textBlock.childNodes.length ? textBlock : '';
    }

    // Only push slides with an image
    if (mainImg) {
      cells.push([mainImg, textCell]);
    }
  });

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
