/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards40)'];
  const ul = element.querySelector('ul');
  const lis = ul ? Array.from(ul.children) : [];
  const rows = lis.map((li) => {
    // 1. Extract the image
    let imgEl = null;
    const bgDiv = li.querySelector('div[data-test-id^="highlight-rail-background-image-"]');
    if (bgDiv) {
      // Try computed style for background-image (browser only)
      let bgUrl = '';
      let cs = null;
      if (window.getComputedStyle) {
        cs = window.getComputedStyle(bgDiv);
      }
      if (cs && cs.backgroundImage && cs.backgroundImage !== 'none') {
        const match = cs.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
        if (match && match[1]) {
          imgEl = document.createElement('img');
          imgEl.src = match[1];
          imgEl.alt = '';
        }
      }
      // fallback (no bg image found): leave cell empty
    }
    // 2. Extract the text (title and description)
    const contentDiv = li.querySelector('[data-skyui-core^="Box@"], .box__Box-sc-1i8zs0c-0');
    let textCell = document.createElement('div');
    let added = false;
    if (contentDiv) {
      // Title
      const heading = contentDiv.querySelector('span[data-test-id^="highlight-card-heading-"]');
      if (heading && heading.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = heading.textContent.trim();
        textCell.appendChild(strong);
        textCell.appendChild(document.createElement('br'));
        added = true;
      }
      // Description
      const desc = contentDiv.querySelector('span[data-test-id^="highlight-card-subHeading-"]');
      if (desc && desc.textContent.trim()) {
        const descSpan = document.createElement('span');
        descSpan.textContent = desc.textContent.trim();
        textCell.appendChild(descSpan);
        added = true;
      }
    }
    if (!added) {
      // fallback: use all textual content
      textCell.textContent = li.textContent.trim();
    }

    return [imgEl, textCell];
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
