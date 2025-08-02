/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Hero (hero6)'];

  // --- Row 2: Background image (the main/large image) ---
  // Try to find the main background image by test id
  let bgImg = element.querySelector('img[data-test-id="content-gallery-hero-background-image"]');
  if (!bgImg) {
    // Fallback: first image
    bgImg = element.querySelector('img');
  }
  const row2 = [bgImg ? bgImg : ''];

  // --- Row 3: Text content, heading, subheading, overline, extra images/text ---
  // The main heading is in <h2> (with possible overline), description is in flex boxes, promo img/text may appear after main image

  // Gather all elements that are part of the text+promo area
  const contentElements = [];

  // 1. Grab the <h2> and all its content (overline, heading, etc)
  const h2 = element.querySelector('h2');
  if (h2) {
    contentElements.push(h2);
  }

  // 2. Find any description/content paragraph immediately after h2
  // This is typically in a nearby div[data-skyui-core^="Text@"].
  // Get all such divs not inside h2 and not inside image container
  const textBlocks = Array.from(element.querySelectorAll('div[data-skyui-core^="Text@"]'));
  textBlocks.forEach(div => {
    if (!h2 || !h2.contains(div)) {
      // If this text block is not contained by h2, add if not already in array
      if (!contentElements.includes(div) && div.textContent.trim()) {
        contentElements.push(div);
      }
    }
  });

  // 3. Promo image that is not the background image
  // The second <img> (if any) is the promo image
  const imgs = Array.from(element.querySelectorAll('img'));
  let promoImg = null;
  if (imgs.length > 1) {
    promoImg = imgs[1];
    if (promoImg !== bgImg) {
      contentElements.push(promoImg);
    }
  }

  // 4. Any supporting text (like "Available now")
  // This is usually a <p> somewhere after the promo image
  const supportingPs = Array.from(element.querySelectorAll('p'));
  supportingPs.forEach(p => {
    if (p.textContent.trim() && !contentElements.includes(p)) {
      contentElements.push(p);
    }
  });

  // Remove any accidental duplicates
  const seen = new Set();
  const contentCell = contentElements.filter(el => {
    if (!el) return false;
    if (seen.has(el)) return false;
    seen.add(el);
    return true;
  });

  // If nothing, put empty string
  const row3 = [contentCell.length ? contentCell : ''];

  // Compose the table
  const cells = [headerRow, row2, row3];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
