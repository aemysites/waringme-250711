/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header
  const headerRow = ['Cards (cards64)'];
  const rows = [headerRow];

  // The list of cards
  const ul = element.querySelector('ul');
  if (!ul) return;

  ul.querySelectorAll(':scope > li').forEach((li) => {
    // IMAGE/ICON COLUMN
    let mediaEl = null;
    // Image or video poster are present inside a .sc-cBBoUG
    const cardWrapper = li.querySelector('.sc-cBBoUG');
    // Try video first
    const video = cardWrapper && cardWrapper.querySelector('video');
    if (video && video.poster) {
      // Use video poster as the card image
      mediaEl = document.createElement('img');
      mediaEl.src = video.poster;
      mediaEl.alt = '';
    } else {
      // Otherwise, check for background-image via style or known class
      // Try to find the div with data-test-id^="highlight-rail-background-image-"
      const bgDiv = cardWrapper && cardWrapper.querySelector('[data-test-id^="highlight-rail-background-image-"]');
      let bgUrl = '';
      if (bgDiv) {
        // Try to get style background-image
        const styleAttr = bgDiv.getAttribute('style') || '';
        const match = styleAttr.match(/background-image\s*:\s*url\((['"]?)(.*?)\1\)/);
        if (match) {
          bgUrl = match[2];
        } else {
          // Sometimes the background is set via CSS class; not accessible inline, so skip
          bgUrl = '';
        }
      }
      if (bgUrl) {
        mediaEl = document.createElement('img');
        mediaEl.src = bgUrl;
        mediaEl.alt = '';
      } else {
        // If all fails, insert an empty placeholder div to keep column count correct
        mediaEl = document.createElement('div');
        mediaEl.style.width = '100px';
        mediaEl.style.height = '56px';
        mediaEl.setAttribute('aria-label', 'card image placeholder');
      }
    }

    // TEXT COLUMN
    let textCell = null;
    // Use the .sc-iJJAuK or Box@11.8.0 for all card text content
    const textBox = li.querySelector('.sc-iJJAuK, [data-skyui-core^="Box"]');
    if (textBox) {
      // Use direct children: two spans, first is heading, second is description
      const spans = textBox.querySelectorAll('span[data-skyui-core^="Text"]');
      let textArr = [];
      if (spans[0]) {
        const strong = document.createElement('strong');
        strong.textContent = spans[0].textContent;
        textArr.push(strong);
      }
      if (spans[1]) {
        textArr.push(document.createElement('br'));
        textArr.push(spans[1].textContent);
      }
      if (textArr.length > 0) {
        textCell = textArr;
      } else {
        // fallback: use textBox textContent
        textCell = textBox.textContent;
      }
    } else {
      // fallback for missing text content
      textCell = '';
    }

    rows.push([
      mediaEl,
      textCell
    ]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
