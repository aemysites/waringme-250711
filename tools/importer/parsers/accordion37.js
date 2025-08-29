/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion wrapper (should have data-skyui-core starting with Accordion)
  let accordionWrapper = null;
  // Search recursively for the accordion wrapper within the block, as nesting may vary
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      return node.getAttribute && node.getAttribute('data-skyui-core') && node.getAttribute('data-skyui-core').startsWith('Accordion@') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  accordionWrapper = walker.nextNode();
  if (!accordionWrapper) return;

  // Get title: find the button text under h2/button
  const headingBtn = accordionWrapper.querySelector('h2 > button');
  let title = '';
  if (headingBtn) {
    // Use all childNodes except for icon wrapper
    const children = Array.from(headingBtn.childNodes);
    // Typically first child is span with text, last is icon span
    if (children.length) {
      // Find first text container
      let titleCandidate = null;
      for (const c of children) {
        if (c.nodeType === Node.ELEMENT_NODE && c.querySelector('.heading__Children-sc-bbpayh-0')) {
          titleCandidate = c.querySelector('.heading__Children-sc-bbpayh-0');
          break;
        }
      }
      if (titleCandidate) {
        title = titleCandidate.textContent.trim();
      } else {
        // fallback: just textContent of button minus trailing icon
        title = headingBtn.textContent.trim();
      }
    } else {
      title = headingBtn.textContent.trim();
    }
  }

  // Get accordion content panel
  const contentPanel = accordionWrapper.querySelector('[role="region"]');
  if (!contentPanel) return;
  // The content is inside a .content__Inner-sc-m4v15p-0 div, usually a single child, but fallback to panel itself if missing
  let contentDiv = contentPanel.querySelector('.content__Inner-sc-m4v15p-0');
  if (!contentDiv) contentDiv = contentPanel;
  // The real content (legal text etc) is another nested box, but we just reference the main content div
  // Only reference the child that holds the content: [data-test-id="legals-accordion-content"]
  let richContent = contentDiv.querySelector('[data-test-id="legals-accordion-content"]');
  if (!richContent) richContent = contentDiv;

  // Prepare the block table according to the spec: header row then one [title, content] row
  const headerRow = ['Accordion (accordion37)'];
  const rows = [headerRow, [title, richContent]];

  // Create block and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
