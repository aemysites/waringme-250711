/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: Must match exactly 'Hero (hero6)'
  const headerRow = ['Hero (hero6)'];

  // Second row for background image; none present in the HTML
  const backgroundRow = [''];

  // Third row: extract heading, paragraph, and CTA links
  // Heading: look for the h2 or similar heading
  let heading = element.querySelector('h2');

  // Paragraph/Intro: look for the first .text__TextElement-sc-qf7y4e-0.jVKIid (generic for paragraph)
  let intro = null;
  const introBox = element.querySelector('.text__TextElement-sc-qf7y4e-0.jVKIid');
  if (introBox) intro = introBox;

  // CTAs: all <a> elements with data-test-id="section-cta-link"
  const ctaLinks = Array.from(element.querySelectorAll('a[data-test-id="section-cta-link"]'));

  // Compose content cell: preserve structure and semantic grouping
  const cellContent = [];
  if (heading) cellContent.push(heading);
  if (intro) cellContent.push(intro);
  if (ctaLinks.length) {
    // Group all CTAs in a div, separated by spaces
    const ctaDiv = document.createElement('div');
    ctaLinks.forEach((cta, i) => {
      ctaDiv.appendChild(cta);
      if (i < ctaLinks.length - 1) ctaDiv.appendChild(document.createTextNode(' '));
    });
    cellContent.push(ctaDiv);
  }

  // The third row (content)
  const contentRow = [cellContent];

  // Compose the table for this block
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    backgroundRow,
    contentRow
  ], document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
