/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get background image URL from style
  function getBackgroundImageURL(div) {
    const style = window.getComputedStyle(div);
    const bg = style.backgroundImage;
    if (bg && bg !== 'none') {
      const match = bg.match(/url\(["']?(.*?)["']?\)/);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  }

  // Helper to create <img> element from url and alt
  function createImg(url, alt) {
    const img = document.createElement('img');
    img.src = url;
    if (alt) img.alt = alt;
    return img;
  }

  // Get all <li> cards
  const cards = Array.from(element.querySelectorAll('ul > li'));
  const rows = [['Cards (cards67)']];

  cards.forEach((card) => {
    // IMAGE CELL
    let imgEl = null;
    // Try to find a div with background image
    const possibleBgDiv = card.querySelector('[data-test-id^="highlight-rail-background-image"], .sc-cROYWz');
    let imgUrl = null;
    if (possibleBgDiv) {
      imgUrl = getBackgroundImageURL(possibleBgDiv);
    }
    // If not found, try a <video> with poster
    if (!imgUrl) {
      const video = card.querySelector('video[poster]');
      if (video && video.poster) {
        imgUrl = video.poster;
      }
    }
    if (imgUrl) {
      // Alt is the heading or empty
      const heading = card.querySelector('[data-test-id^="highlight-card-heading"]');
      imgEl = createImg(imgUrl, heading ? heading.textContent.trim() : '');
    }

    // TEXT CELL
    // Find the card content box
    const textBox = card.querySelector('.sc-kTNzjB, [data-skyui-core^="Box"]');
    let textCellContent = textBox;
    // If not found, fallback to all spans in card
    if (!textCellContent) {
      const allSpans = Array.from(card.querySelectorAll('span'));
      if (allSpans.length) {
        textCellContent = allSpans;
      }
    }

    // Add to table row
    rows.push([
      imgEl,
      textCellContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
