/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: must match example exactly
  const headerRow = ['Cards (cards60)'];

  // Each card is: image/icon in cell 1, text (title/desc/button) in cell 2
  // The cards are the three hero media images/videos and their overlay text
  // In the provided HTML, the overlay text ("Mr Bigstuff S2", "Happy Gilmore 2", "Full Fibre") is not represented as text nodes -- it's only present visually in the screenshot as image overlays.
  // The only text available in HTML is the block heading and description below the cards ("Sky Deals", "Our best deals ...")
  // Per instructions, we must NOT invent elements or text not present in the HTML.

  // Identify all hero media elements (video or image)
  const mediaHeroes = Array.from(element.querySelectorAll('[data-test-id="media-hero"]'));

  // Gather all images/videos from each hero media wrapper
  const cardMedias = mediaHeroes.map(wrapper => {
    // Prefer <video> if present
    let m = wrapper.querySelector('video');
    if (!m) {
      m = wrapper.querySelector('img');
    }
    return m;
  }).filter(Boolean);

  // Find the hero content block (heading and desc)
  const dealsContent = element.querySelector('[data-test-id="deals-hero-content"]');
  let dealsHeading = dealsContent && dealsContent.querySelector('h1');
  let dealsDesc = dealsContent && dealsContent.querySelector('p');
  // Create the text cell for the first card
  const firstTextCell = [];
  if (dealsHeading) firstTextCell.push(dealsHeading);
  if (dealsDesc) firstTextCell.push(dealsDesc);

  // Build the table rows: each card gets one row
  // Only the first card gets text since only that text exists in HTML
  const rows = cardMedias.map((media, i) => {
    return i === 0 ? [media, firstTextCell] : [media, ''];
  });

  // Table structure: header + N card rows
  const cells = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
