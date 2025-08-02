/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Carousel (carousel30)'];
  // Find the carousel rail - the container for the slides
  const rail = element.querySelector('[class*="rail__Wrapper"], [data-skyui-core*="Rail"]');
  let slides = [];
  if (rail) {
    // Find the <ul> containing the slides
    const ul = rail.querySelector('ul');
    if (ul) {
      slides = Array.from(ul.children);
    }
  }
  const rows = slides.map((li) => {
    // 1. Main image (always in the <a> as last <img>)
    let mainImg = null;
    const link = li.querySelector('a[data-test-id="hero-rail-card"]');
    if (link) {
      // Try to find the last <img> inside the link, which is the big promo image
      const imgs = link.querySelectorAll('img');
      if (imgs.length > 0) {
        mainImg = imgs[imgs.length - 1];
      }
    }
    // 2. Title
    let titleElem = null;
    const vh = li.querySelector('[data-skyui-core*="VisuallyHiddenText"], .visually-hidden-text__VisuallyHiddenText-sc-n48can-0');
    if (vh && vh.textContent) {
      titleElem = document.createElement('h2');
      titleElem.textContent = vh.textContent.trim();
    }
    // 3. Description
    const desc = li.querySelector('p[data-skyui-core*="Text"]');
    // 4. Included with...
    const included = li.querySelector('.flex__Flex-sc-1r1ee79-0.fLlvsb');
    // 5. No explicit CTA in each slide; only in the main block header.
    const cellItems = [];
    if (titleElem) cellItems.push(titleElem);
    if (desc) cellItems.push(desc);
    if (included) cellItems.push(included);
    return [mainImg, cellItems];
  });
  const tableRows = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  // Replace original element
  element.replaceWith(block);
}
