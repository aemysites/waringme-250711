/* global WebImporter */
export default function parse(element, { document }) {
  // Set up the header row as specified
  const headerRow = ['Carousel (carousel33)'];
  const rows = [headerRow];

  // Find the carousel list of slides (ul)
  const slidesList = element.querySelector('ul.items__Element-sc-behb7x-0');
  if (!slidesList) return;
  const slideItems = Array.from(slidesList.children);

  slideItems.forEach((li) => {
    // Get the card anchor for each slide
    const cardAnchor = li.querySelector('a[data-test-id="hero-rail-card"]');
    if (!cardAnchor) return;

    // Get the main slide image (last img inside anchor)
    const imgList = cardAnchor.querySelectorAll('img');
    let slideImg = null;
    if (imgList.length) {
      slideImg = imgList[imgList.length - 1];
    }

    // First cell is the image element only
    const imageCell = slideImg;

    // Second cell: text content
    // Use a fragment div to hold multiple child elements (display: contents prevents it from rendering extra structure)
    const textCellFrag = document.createElement('div');
    textCellFrag.style.display = 'contents';

    // 1. Try to get the visually hidden title (as heading)
    const hiddenTitle = cardAnchor.querySelector('.visually-hidden-text__VisuallyHiddenText-sc-n48can-0');
    if (hiddenTitle && hiddenTitle.textContent.trim()) {
      const h2 = document.createElement('h2');
      h2.textContent = hiddenTitle.textContent.trim();
      textCellFrag.appendChild(h2);
    }

    // 2. Description (the <p> inside the card)
    const desc = cardAnchor.querySelector('p.text__TextElement-sc-qf7y4e-0');
    if (desc && desc.textContent.trim()) {
      textCellFrag.appendChild(desc);
    }

    // 3. Included Info (e.g. Included with Ultimate TV)
    // This is always in a .flex__Flex-sc-1r1ee79-0, but only the one that contains a .text__TextElement-sc-qf7y4e-0.jERxqS
    const includedInfoSpan = cardAnchor.querySelector('.text__TextElement-sc-qf7y4e-0.jERxqS');
    if (includedInfoSpan) {
      const parentFlex = includedInfoSpan.closest('.flex__Flex-sc-1r1ee79-0');
      if (parentFlex) {
        textCellFrag.appendChild(parentFlex);
      } else {
        textCellFrag.appendChild(includedInfoSpan);
      }
    }

    // 4. If there are any additional links in the cardAnchor that are not part of includedInfoSpan, add them (e.g., CTA)
    // This is not present in the sample HTML but would be handled by the following:
    // (uncomment below to future-proof)
    /*
    cardAnchor.querySelectorAll('a').forEach(a => {
      if (!textCellFrag.contains(a)) {
        textCellFrag.appendChild(a);
      }
    });
    */

    // Add row for this slide
    rows.push([imageCell, textCellFrag]);
  });

  // Create the carousel table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
