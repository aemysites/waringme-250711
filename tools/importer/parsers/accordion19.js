/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row as per example
  const headerRow = ['Accordion (accordion19)'];

  // Find the FAQ list (ul)
  const faqList = element.querySelector('ul');
  if (!faqList) return;

  // Get all the FAQ items (li)
  const faqItems = Array.from(faqList.children);
  const rows = [headerRow];

  faqItems.forEach((faqItem) => {
    // Extract the question (title cell)
    let titleCell = '';
    const h3 = faqItem.querySelector('h3');
    if (h3) {
      // Only get the span that holds the title/question
      const questionSpan = h3.querySelector('.heading__Children-sc-bbpayh-0, span');
      if (questionSpan) {
        titleCell = questionSpan;
      } else {
        // fallback: use the whole h3
        titleCell = h3;
      }
    }
    // Extract the answer (content cell)
    let contentCell = '';
    // Region containing answer (may be hidden by default)
    const contentRegion = faqItem.querySelector('div[role="region"]');
    if (contentRegion) {
      // Get the most specific element containing the answer text
      // Usually a span[data-skyui-core^="Markdown"]
      const markdownSpan = contentRegion.querySelector('span[data-skyui-core^="Markdown"]');
      if (markdownSpan) {
        contentCell = markdownSpan;
      } else {
        // fallback: use the full region
        contentCell = contentRegion;
      }
    }
    rows.push([
      titleCell,
      contentCell
    ]);
  });

  // Create the block table using references to existing elements
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
