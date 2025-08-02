/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards13)'];
  const cells = [headerRow];

  // Find the first visible tabpanel (no aria-hidden or aria-hidden="false")
  const tabpanels = element.querySelectorAll('[role="tabpanel"]');
  let galleryPanel = null;
  for (const panel of tabpanels) {
    if (!panel.hasAttribute('aria-hidden') || panel.getAttribute('aria-hidden') === 'false') {
      galleryPanel = panel;
      break;
    }
  }
  if (!galleryPanel) {
    element.replaceWith(WebImporter.DOMUtils.createTable(cells, document));
    return;
  }
  // Get all <li> inside the visible panel's <ul>
  const lis = Array.from(galleryPanel.querySelectorAll('ul > li'));
  for (const li of lis) {
    const img = li.querySelector('img');
    let imageCell = '';
    let textCell = '';
    if (img) {
      imageCell = img;
      const title = img.getAttribute('alt') || '';
      let heading = null;
      if (title) {
        heading = document.createElement('strong');
        heading.textContent = title;
      }
      // Attempt to find description text, if any, after the image
      let description = '';
      let foundImg = false;
      li.childNodes.forEach((node) => {
        if (node === img) {
          foundImg = true;
        } else if (foundImg) {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            description += node.textContent.trim() + ' ';
          } else if (node.nodeType === Node.ELEMENT_NODE && node !== img && node.textContent.trim()) {
            description += node.textContent.trim() + ' ';
          }
        }
      });
      description = description.trim();
      // If no description found after <img>, try before <img> (some HTML may have it before)
      if (!description) {
        li.childNodes.forEach((node) => {
          if (node !== img && node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            description += node.textContent.trim() + ' ';
          }
        });
        description = description.trim();
      }
      const fragments = [];
      if (heading) fragments.push(heading);
      if (description) {
        const descP = document.createElement('p');
        descP.textContent = description;
        fragments.push(descP);
      }
      textCell = fragments.length > 1 ? fragments : (fragments[0] || '');
    } else {
      // If no image, use text
      textCell = li.textContent.trim();
    }
    cells.push([imageCell, textCell]);
  }
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
