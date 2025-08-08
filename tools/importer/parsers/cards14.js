/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards14)'];
  const rows = [];
  const list = element.querySelector('ul.items__Element-sc-behb7x-0');
  if (!list) return;
  const lis = Array.from(list.children);
  lis.forEach((li) => {
    // Main Card Image (exclude sub-offer icons)
    let image = '';
    const imgDiv = li.querySelector('.sc-crHHJw');
    if (imgDiv) {
      const img = imgDiv.querySelector('img');
      if (img) image = img;
    }
    // Collect only relevant structured elements (not the full box)
    const content = [];
    // Category label
    const category = li.querySelector('.gfCeyd span, [data-test-id="deals-categories"] span');
    if (category && category.textContent.trim()) {
      content.push(category);
    }
    // Title
    const h2 = li.querySelector('h2');
    if (h2 && h2.textContent.trim()) {
      content.push(h2);
    }
    // Sub-offers icons row (ul)
    const subOffersUl = li.querySelector('[data-test-id="sub-offers"] ul');
    if (subOffersUl) {
      content.push(subOffersUl);
    }
    // Feature/Price blocks: .pricing-elements__Container-sc-1keidlr-0 and its parent
    const pricing = li.querySelector('.pricing-elements__Container-sc-1keidlr-0');
    if (pricing && pricing.parentElement && pricing.parentElement.textContent.trim()) {
      content.push(pricing.parentElement);
    }
    // Pricing note (contract length, etc): look for .fOrFER
    const pricingNote = li.querySelector('.fOrFER');
    if (pricingNote && pricingNote.textContent.trim()) {
      content.push(pricingNote);
    }
    // Extra features/highlights (e.g. No upfront fees, extra channels)
    const extras = li.querySelectorAll('.eUsJPJ, .jfcxVH');
    extras.forEach((ex) => {
      const parent = ex.parentElement;
      if (parent && parent.textContent.trim() && !content.includes(parent)) {
        content.push(parent);
      }
    });
    // CTA button (Get Started)
    const cta = li.querySelector('a.button__Button-sc-1m4qkvf-0, a[data-skyui-core="Button@11.8.0"]');
    if (cta) content.push(cta);
    // Card callout (e.g. 10GB data for £5...), if present
    const callout = li.querySelector('[data-test-id="deal-card-callout"]');
    if (callout && callout.textContent.trim()) {
      content.push(callout);
    }
    // Disclaimer
    const disclaimer = li.querySelector('[data-test-id$="deal-disclaimer"]');
    if (disclaimer && disclaimer.textContent.trim()) {
      content.push(disclaimer);
    }
    // Fallback: if content is empty, include any direct text nodes of li
    if (content.length === 0) {
      Array.from(li.childNodes).forEach((node) => {
        if (node.nodeType === 3 && node.textContent.trim()) {
          content.push(document.createTextNode(node.textContent));
        }
      });
    }
    rows.push([
      image || '',
      content.length === 1 ? content[0] : content
    ]);
  });
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
