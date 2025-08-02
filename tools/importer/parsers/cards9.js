/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Prepare the header exactly as specified in the example
  const headerRow = ['Cards (cards9)'];

  // 2. Optional lead/intro row: extract intro heading and description, if present
  let introHeading = null;
  let introDesc = null;
  // Find the first h2
  const h2 = element.querySelector('h2');
  if (h2) {
    introHeading = h2;
    // Try to find the paragraph/markdown intro text (usually in a span inside another box)
    // Look for any sibling in the same parent hierarchy with a span
    const introBox = h2.closest('div');
    if (introBox) {
      const descSpan = introBox.querySelector('div[data-skyui-core*="Markdown"], .box__Box-sc-1i8zs0c-0.hxPhwb, span[data-skyui-core*="Markdown"]');
      if (descSpan) {
        introDesc = descSpan;
      }
    }
  }

  // 3. Gather all card LIs (ul > li)
  const cardLis = element.querySelectorAll('ul.sc-hLQSwg.kqVHMs > li');
  const rows = [];

  cardLis.forEach(li => {
    // Card link
    const cardLink = li.querySelector('a');
    // Card image: the first .sc-kiTBBF img (main image)
    let img = cardLink.querySelector('.sc-kiTBBF img');
    if (!img) img = cardLink.querySelector('img'); // fallback

    // Card text: title (h3) and desc (p)
    const textBox = cardLink.querySelector('.cahull .fHkWjE');
    let title = null, desc = null;
    if (textBox) {
      title = textBox.querySelector('h3');
      desc = textBox.querySelector('p');
    }

    // 2nd cell: compose text content with semantic HTML (heading strong, then linebreak, then description)
    const textFrag = document.createDocumentFragment();
    if (title) {
      const strong = document.createElement('strong');
      strong.innerHTML = title.innerHTML;
      textFrag.appendChild(strong);
      textFrag.appendChild(document.createElement('br'));
    }
    if (desc) {
      // Use a span for description (to match semantic grouping)
      const span = document.createElement('span');
      span.innerHTML = desc.innerHTML;
      textFrag.appendChild(span);
    }
    // Per spec, CTA is not required unless visible in the example
    rows.push([img, textFrag]);
  });

  // 4. Add intro row if there is intro content
  if (introHeading || introDesc) {
    const introFrag = document.createDocumentFragment();
    if (introHeading) {
      const strong = document.createElement('strong');
      strong.textContent = introHeading.textContent;
      introFrag.appendChild(strong);
      introFrag.appendChild(document.createElement('br'));
    }
    if (introDesc) {
      // Use only the text content (not whole div, just the contained text)
      const span = document.createElement('span');
      span.textContent = introDesc.textContent.trim();
      introFrag.appendChild(span);
    }
    rows.unshift(['', introFrag]); // empty image cell
  }

  // 5. Build the table, preserving order: header, intro row (if any), then cards
  const tableRows = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
