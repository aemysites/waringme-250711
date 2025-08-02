/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as in the example
  const rows = [['Cards (cards1)']];

  // Find the UL containing the cards
  const ul = element.querySelector('ul');
  if (!ul) return;

  // Loop through each LI (card)
  Array.from(ul.children).forEach(li => {
    // --- IMAGE ---
    // Find first <img> inside the <a> that has a non-empty src and a non-empty alt
    let img = null;
    const link = li.querySelector('a');
    if (link) {
      const imgs = Array.from(link.querySelectorAll('img'));
      img = imgs.find(im => im.src && im.getAttribute('alt') && im.getAttribute('alt').trim() !== '');
      if (!img && imgs.length > 0) {
        img = imgs[0];
      }
    }

    // --- TEXT ---
    // Gather all text content for card, for robustness
    // 1. Get all text nodes in li that are not inside <a> (for card title/description)
    // 2. Also get any text inside <a> that could serve as a CTA (link text)
    // 3. Output a title (strong) and, if present, description (div or p), and CTA (link)
    
    // Helper to get all non-empty text nodes in a node, optionally excluding inside a given element
    function getTextNodes(root, excludeElem) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: function(node) {
          if (excludeElem && excludeElem.contains(node)) return NodeFilter.FILTER_REJECT;
          if (node.textContent.trim().length > 0) return NodeFilter.FILTER_ACCEPT;
          return NodeFilter.FILTER_REJECT;
        }
      });
      const txts = [];
      let n;
      while((n = walker.nextNode())) {
        txts.push(n.textContent.trim());
      }
      return txts;
    }
    // 1. Get all text NOT inside <a> (for title/desc)
    const textParts = getTextNodes(li, link);
    let textCellContent = [];
    if (textParts.length > 0) {
      // First part: strong (title)
      const strong = document.createElement('strong');
      strong.textContent = textParts[0];
      textCellContent.push(strong);
      // Any further parts: put in divs (description)
      for (let i = 1; i < textParts.length; i++) {
        const div = document.createElement('div');
        div.textContent = textParts[i];
        textCellContent.push(div);
      }
    }
    // 2. Find any CTA link inside <a> that is not just an image
    // We'll use data-tracking-text or fallback to link's textContent
    if (link) {
      // Find any text node in <a> that is not a descendant of <img>
      const linkTextNodes = getTextNodes(link, null);
      // Remove text from span with 'aria-label' or empty
      const cleanLinkText = linkTextNodes.filter(t => t && t.length > 0).join(' ').trim();
      if (cleanLinkText) {
        const cta = document.createElement('a');
        cta.href = link.href;
        cta.textContent = cleanLinkText;
        textCellContent.push(document.createElement('br'));
        textCellContent.push(cta);
      }
    }
    // fallback: at least an empty string
    if (textCellContent.length === 0) textCellContent = [''];
    // Add to table rows
    rows.push([
      img,
      textCellContent
    ]);
  });

  // Create block table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
