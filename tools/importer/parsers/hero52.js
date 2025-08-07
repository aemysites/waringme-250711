/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero52)'];

  // 2. Background image row (none in the given HTML)
  const bgImageRow = [''];

  // 3. Content row: Title, subheading, CTA
  // In this HTML: Title is a <span>, CTA is a <a>. There is no explicit subheading.
  // Only use direct children structure to ensure resilience.

  // Find the container for text and button
  // Structure: ...<Flex><span>text</span><a>link</a></Flex>...
  const mainContent = element.querySelector('.flex__Flex-sc-1r1ee79-0, [data-skyui-core^="Flex@"][class*="flex__Flex-"]');

  const content = [];
  if (mainContent) {
    const children = Array.from(mainContent.children);
    for (const child of children) {
      // A span is likely the headline/title
      if (child.tagName === 'SPAN' && child.textContent.trim()) {
        content.push(child);
      }
      // An anchor is likely the CTA
      else if (child.tagName === 'A' && child.textContent.trim()) {
        content.push(child);
      }
      // (There is no subheading in this HTML example)
    }
  }

  // If something fails, as fallback, grab all descendants that are <span> or <a>
  if (content.length === 0) {
    const fallbackSpans = element.querySelectorAll('span');
    fallbackSpans.forEach(span => { if(span.textContent.trim()) content.push(span); });
    const fallbackAnchors = element.querySelectorAll('a');
    fallbackAnchors.forEach(a => { if(a.textContent.trim()) content.push(a); });
  }

  // Put all found content in a single cell (as array of elements)
  const contentRow = [content];

  const cells = [
    headerRow,
    bgImageRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
