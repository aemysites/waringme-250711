/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header as per example
  const headerRow = ['Accordion (accordion33)'];
  
  // Select each accordion item: direct children with class 'accordion' or 'w-dropdown'
  const accordionItems = Array.from(element.querySelectorAll(':scope > .accordion, :scope > .w-dropdown'));
  
  const rows = accordionItems.map(item => {
    // Find the title in the toggle button
    let titleEl = null;
    const toggle = item.querySelector('.w-dropdown-toggle');
    if (toggle) {
      // Prefer '.paragraph-lg', fallback to first child div that isn't icon, else toggle itself
      titleEl = toggle.querySelector('.paragraph-lg');
      if (!titleEl) {
        const divs = Array.from(toggle.children).filter(d => !d.classList.contains('dropdown-icon'));
        titleEl = divs[0] || toggle;
      }
    }
    // Find content for the accordion item
    let contentEl = null;
    const contentNav = item.querySelector('.accordion-content, .w-dropdown-list');
    if (contentNav) {
      // Prefer .rich-text/.w-richtext, else inner div, else contentNav
      contentEl = contentNav.querySelector('.rich-text, .w-richtext');
      if (!contentEl) {
        // Find first child div or p
        const firstDivOrP = contentNav.querySelector('div, p');
        contentEl = firstDivOrP || contentNav;
      }
    }
    // Defensive: If title or content is missing, fallback to empty div
    if (!titleEl) titleEl = document.createElement('div');
    if (!contentEl) contentEl = document.createElement('div');
    return [titleEl, contentEl];
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  
  element.replaceWith(table);
}
