/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must be a single cell (one column)
  const headerRow = ['Columns (columns4)'];

  // Find the first visible tabpanel (not aria-hidden or aria-hidden="false")
  const panels = element.querySelectorAll('div[role="tabpanel"]');
  let activePanel = null;
  for (const panel of panels) {
    if (!panel.hasAttribute('aria-hidden') || panel.getAttribute('aria-hidden') === 'false') {
      activePanel = panel;
      break;
    }
  }
  if (!activePanel) activePanel = panels[0];

  // Get direct <ul> child and its <li> children
  const ul = activePanel.querySelector('ul');
  const lis = ul ? Array.from(ul.children) : [];
  // For each li, take its <img> element (or if not present, the whole li)
  const images = lis.map(li => li.querySelector('img') || li);

  // Create table rows: first row is always a single cell (header), second row is N cells (the images)
  const rows = [headerRow, images];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
