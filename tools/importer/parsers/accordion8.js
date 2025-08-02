/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main Accordion wrapper
  const accordion = element.querySelector('[data-skyui-core^="Accordion@"], .wrapper__Wrapper-sc-ir9ygt-0');
  if (!accordion) return;

  // Get the heading/title - it's inside a button > span > span > ...
  let headingText = '';
  const headingButton = accordion.querySelector('h2 button, button');
  if (headingButton) {
    // Only grab the text part, avoid icons
    headingText = '';
    for (const node of headingButton.childNodes) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
        headingText = node.textContent.trim();
        break;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Look for a span with text
        const innerSpan = node.querySelector('span');
        if (innerSpan && innerSpan.textContent.trim().length > 0) {
          headingText = innerSpan.textContent.trim();
          break;
        }
      }
    }
    if (!headingText && headingButton.textContent) {
      headingText = headingButton.textContent.trim();
    }
  }
  if (!headingText) headingText = 'Accordion';

  // Get the content element (the panel)
  // Should be a div with aria-labelledby and role=region (and aria-hidden/hidden), possibly nested
  let contentPanel = accordion.querySelector('[aria-labelledby][role="region"]');
  if (!contentPanel) {
    // fallback by class
    contentPanel = accordion.querySelector('.content__Wrapper-sc-m4v15p-1');
  }
  let content;
  if (contentPanel) {
    // Find deepest content block, usually with data-test-id="legals-accordion-content"
    const deepContent = contentPanel.querySelector('[data-test-id="legals-accordion-content"]');
    if (deepContent) {
      content = deepContent;
    } else {
      content = contentPanel;
    }
  } else {
    // fallback: no content found
    content = document.createElement('div');
  }

  // Compose the table as per the required structure
  const cells = [
    ['Accordion (accordion8)'],
    [headingText, content]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
