/* global WebImporter */
export default function parse(element, { document }) {
  // Header row with block name exactly as in example
  const headerRow = ['Cards (cards15)'];

  // Find the flex row that contains the two card blocks
  const mainContentDiv = element.querySelector('div > div > div.flex__Flex-sc-1r1ee79-0.jmUgLh');
  if (!mainContentDiv) return;
  const cardsRow = mainContentDiv.querySelector('div.flex__Flex-sc-1r1ee79-0.dNBTcY');
  if (!cardsRow) return;
  const cardDivs = Array.from(cardsRow.children).filter(
    child => child.querySelector('img')
  );

  // Map each card to a row [ image, text content ]
  const rows = cardDivs.map(card => {
    const img = card.querySelector('img');
    // The text box is the div with the two <p> tags
    const textBox = card.querySelector('div.keZUXi > div');
    const ps = textBox ? Array.from(textBox.querySelectorAll('p')) : [];
    const cta = card.querySelector('a');
    // Compose text cell: Heading (strong or h3), then desc(s), then CTA
    const cellParts = [];
    if (ps.length > 0) {
      // First paragraph as strong (title)
      const strong = document.createElement('strong');
      strong.innerHTML = ps[0].innerHTML;
      cellParts.push(strong);
    }
    if (ps.length > 1) {
      cellParts.push(document.createElement('br'));
      cellParts.push(ps[1]);
    }
    if (cta) {
      cellParts.push(document.createElement('br'));
      cellParts.push(cta);
    }
    // Fallback: if text is truly missing, add an empty string
    if (cellParts.length === 0) cellParts.push('');
    return [img, cellParts];
  });

  // Compose and replace
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
