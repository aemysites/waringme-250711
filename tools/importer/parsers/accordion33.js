/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match example exactly
  const headerRow = ['Accordion (accordion33)'];
  const rows = [];

  // Get all the top-level <li> elements (accordion items)
  const items = element.querySelectorAll(':scope > li');

  items.forEach((li) => {
    // --- TITLE CELL ---
    // We want the question text (the visible title of the accordion item)
    let title;
    const h3 = li.querySelector('h3');
    if (h3) {
      const button = h3.querySelector('button');
      if (button) {
        // The first span in the button is always the title text span
        const spans = button.querySelectorAll('span');
        if (spans.length > 0) {
          title = spans[0]; // Reference the existing span element
        } else {
          // fallback, use button text
          title = document.createElement('span');
          title.textContent = button.textContent.trim();
        }
      }
    }
    if (!title) {
      // fallback: use li text
      title = document.createElement('span');
      title.textContent = li.textContent.trim();
    }

    // --- CONTENT CELL ---
    // We want the content that would be revealed in the accordion
    let contentCell = null;
    // The content area is in a div[role=region] with a div with data-skyui-core Markdown@... inside
    const contentRegion = li.querySelector('div[role="region"]');
    if (contentRegion) {
      // Find the deepest div[data-skyui-core="Markdown@11.8.0"] inside region
      const markdownDiv = contentRegion.querySelector('div[data-skyui-core^="Markdown@"]');
      if (markdownDiv) {
        // Reference the outermost parent box that is a box-- this ensures we keep structure/formatting
        let outerBox = markdownDiv;
        let current = markdownDiv;
        while (
          current.parentElement &&
          current.parentElement !== contentRegion &&
          current.parentElement.hasAttribute('data-skyui-core') &&
          current.parentElement.getAttribute('data-skyui-core').startsWith('Box@')
        ) {
          outerBox = current.parentElement;
          current = current.parentElement;
        }
        contentCell = outerBox;
      } else {
        // fallback: if no markdown, use contentRegion content
        contentCell = contentRegion;
      }
    }
    if (!contentCell) {
      // fallback: just use an empty div
      contentCell = document.createElement('div');
    }
    rows.push([title, contentCell]);
  });

  // Compose the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
