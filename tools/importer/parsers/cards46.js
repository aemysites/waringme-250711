/* global WebImporter */
export default function parse(element, { document }) {
  // Header matches example markdown
  const headerRow = ['Cards (cards46)'];

  // Find all direct card <li> elements
  const cards = Array.from(element.querySelectorAll(':scope ul > li'));
  const rows = cards.map(card => {
    // Find background image div
    const imgDiv = card.querySelector('[data-test-id^="highlight-rail-background-image-"]');
    let imgElem = null;
    if (imgDiv) {
      // Try to extract background-image URL
      const bgImage = imgDiv.style.backgroundImage;
      let urlMatch = bgImage && bgImage.match(/url\(["']?(.*?)["']?\)/);
      if (urlMatch && urlMatch[1]) {
        imgElem = document.createElement('img');
        imgElem.src = urlMatch[1];
        imgElem.alt = '';
      } else {
        // If no backgroundImage, check for <img> inside
        const possibleImg = imgDiv.querySelector('img');
        if (possibleImg) {
          imgElem = possibleImg;
        }
      }
    }

    // Compose text content
    const heading = card.querySelector('[data-test-id^="highlight-card-heading-"]');
    const subheading = card.querySelector('[data-test-id^="highlight-card-subHeading-"]');
    // Use real elements from the DOM if present
    // Use <strong> for the heading and normal for description
    const textCell = document.createElement('div');
    if (heading) {
      const strong = document.createElement('strong');
      strong.textContent = heading.textContent;
      textCell.appendChild(strong);
      textCell.appendChild(document.createElement('br'));
    }
    if (subheading) {
      // Use a <span> for description
      const span = document.createElement('span');
      span.textContent = subheading.textContent;
      textCell.appendChild(span);
    }
    // Robustness for missing image/text
    return [imgElem ? imgElem : '', textCell];
  });

  // Compose the block table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}