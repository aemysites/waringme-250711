/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Get the background image (row 2)
  let bgImg = null;
  const bgImgWrap = element.querySelector('.Hero__MaskBox-sc-f6nat5-1');
  if (bgImgWrap) {
    const candidate = bgImgWrap.querySelector('img');
    if (candidate) bgImg = candidate;
  }
  // 2. Get the content (row 3)
  // This is the big flex containing logo, heading, ctas, text, etc.
  let contentFlex = null;
  // Find the innermost flex containing all hero content (not just buttons)
  // It contains the h1 (visually hidden), logo img, h2, ctas, and strong text.
  const flexCandidates = element.querySelectorAll('.flex__Flex-sc-1r1ee79-0');
  for (const flex of flexCandidates) {
    if (
      flex.querySelector('h1, h2, [data-test-id="show.hero.ctas"], strong')
    ) {
      contentFlex = flex;
      break;
    }
  }
  // Fallback: get first big flex
  if (!contentFlex && flexCandidates.length > 0) {
    contentFlex = flexCandidates[0];
  }
  // Defensive: if background image/content missing, put empty string
  const cells = [
    ['Hero (hero19)'],
    [bgImg ? bgImg : ''],
    [contentFlex ? contentFlex : '']
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
