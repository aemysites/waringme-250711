/* global WebImporter */
export default function parse(element, { document }) {
  // Compose header row
  const headerRow = ['Hero (hero25)'];

  // Background image row: not present in this HTML, so leave empty
  const backgroundRow = [''];

  // Content row: include all text and CTA from the inner flex container
  // (the child <div> holding <span> and <a>)
  let contentDiv = null;
  const divs = element.querySelectorAll(':scope > div');
  for (let div of divs) {
    if (
      div.querySelector('a,button,input[type="submit"],input[type="button"],span,p,h1,h2,h3,h4,h5,h6')
    ) {
      contentDiv = div;
      break;
    }
  }
  if (!contentDiv && divs.length > 0) {
    contentDiv = divs[0];
  }

  // Create the table
  const rows = [
    headerRow,
    backgroundRow,
    [contentDiv ? contentDiv : ''],
  ];

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
