/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the table rows
  const cells = [];
  // Header row: block name
  cells.push(['Hero (hero28)']);
  // Row 2: Background Image (none present in this HTML, so blank)
  cells.push(['']);
  // Row 3: Title, subheading, etc.
  // Try to gather heading and paragraph from the structure
  const content = [];
  // Look for heading (could be h1, h2, etc; here it's h2)
  const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) content.push(heading);
  // Try to find a paragraph/description: the innermost span with text that's not the heading
  let paraText = '';
  // Look for spans inside the box, but skip the heading span if present
  const allSpans = Array.from(element.querySelectorAll('span[data-skyui-core*="Text"], span[data-skyui-core*="Markdown"]'));
  let paraSpan = null;
  if (heading) {
    // If heading contains a span, skip that
    paraSpan = allSpans.find(sp => !heading.contains(sp));
  } else {
    paraSpan = allSpans[0];
  }
  if (paraSpan) {
    // Wrap it in a <p> (paragraph)
    const para = document.createElement('p');
    para.textContent = paraSpan.textContent;
    content.push(para);
  }
  cells.push([content]);
  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
