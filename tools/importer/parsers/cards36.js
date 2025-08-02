/* global WebImporter */
export default function parse(element, { document }) {
  // Block header from spec
  const headerRow = ['Cards (cards36)'];

  // Find the main <ul> of cards flexibly (class names may vary)
  const ul = element.querySelector('ul');
  if (!ul) return;
  const cards = Array.from(ul.children);

  const rows = cards.map((li) => {
    // Find the direct container (should contain <a> and <span>)
    const cardContainer = li.querySelector('div');
    if (!cardContainer) return null;
    // Find the FIRST (main) <img> for the visual
    let img = cardContainer.querySelector('img');
    // Find the label, prefer <span>, as in the current HTML
    const labelSpan = cardContainer.querySelector('span');
    // We'll create a <strong> for the label to match example semantics
    let labelContent = null;
    if (labelSpan) {
      labelContent = document.createElement('strong');
      labelContent.textContent = labelSpan.textContent.trim();
    } else {
      // fallback: use text inside <a>, if no <span>
      const a = cardContainer.querySelector('a');
      if (a && a.textContent.trim()) {
        labelContent = document.createElement('strong');
        labelContent.textContent = a.textContent.trim();
      }
    }
    // Some cards may have additional description, though in this HTML they do not.
    // For flexibility, find any other text nodes in cardContainer (except <span> and <a>)
    // But for this structure, just the label is used.
    // Place image and text as per block requirement, referencing existing elements
    if (img && labelContent) {
      return [img, labelContent];
    }
    return null;
  }).filter(Boolean);

  // Construct the table: header, then one row per card
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
