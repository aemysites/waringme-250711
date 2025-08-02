/* global WebImporter */
export default function parse(element, { document }) {
  // Find the FAQ accordion list
  const faqList = element.querySelector('ul');
  if (!faqList) return;

  // Prepare header row as shown in the example
  const headerRow = ['Accordion (accordion12)'];
  const rows = [headerRow];

  // For each accordion item (li)
  faqList.querySelectorAll(':scope > li').forEach((li) => {
    // Find the title: use the visible span inside the button, if present
    let titleCell = '';
    const button = li.querySelector('h3 button');
    if (button) {
      // There is often more than one span, but the first is the text
      const textSpan = button.querySelector('.heading__Children-sc-bbpayh-0, span');
      if (textSpan) {
        // Reference the span directly from the DOM
        titleCell = textSpan;
      } else {
        // fallback: use button text node
        titleCell = document.createTextNode(button.textContent.trim());
      }
    } else {
      // fallback: use li text
      titleCell = document.createTextNode(li.textContent.trim());
    }

    // Find the content: it's inside div[id$='-content'] > ... > [data-test-id='faq-content'] (which may have more wrappers)
    let contentCell = '';
    const contentDiv = li.querySelector('[id$="-content"]');
    if (contentDiv) {
      // Find the actual content - usually inside [data-test-id='faq-content']
      const faqContent = contentDiv.querySelector('[data-test-id="faq-content"]');
      if (faqContent) {
        // If there is only one child, use it directly, otherwise use all children
        if (faqContent.children.length === 1) {
          contentCell = faqContent.firstElementChild;
        } else if (faqContent.children.length > 1) {
          contentCell = Array.from(faqContent.children);
        } else {
          // fallback to the innerText/node
          contentCell = document.createTextNode(faqContent.textContent.trim());
        }
      } else {
        // fallback: use all child nodes of contentDiv
        if (contentDiv.children.length === 1) {
          contentCell = contentDiv.firstElementChild;
        } else if (contentDiv.children.length > 1) {
          contentCell = Array.from(contentDiv.children);
        } else {
          contentCell = document.createTextNode(contentDiv.textContent.trim());
        }
      }
    } else {
      // fallback: empty
      contentCell = document.createTextNode('');
    }

    rows.push([titleCell, contentCell]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
