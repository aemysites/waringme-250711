/* global WebImporter */
export default function parse(element, { document }) {
  // Find all tabpanels containing the <ul> lists
  const panels = element.querySelectorAll('[role="tabpanel"]');

  // Only use panels with a <ul> child (to be safe)
  let cols = [];
  panels.forEach(panel => {
    const ul = panel.querySelector('ul');
    if (!ul) return;
    // Each <li> in <ul> is a column cell
    ul.querySelectorAll('li').forEach(li => {
      // Each li should normally have one image (or block of content)
      cols.push(li);
    });
  });

  // If there are no columns, do nothing
  if (!cols.length) return;

  // Build final table cells: header (single column), then one row with all content blocks as columns
  const headerRow = ['Columns (columns38)'];
  const contentRow = cols;
  const cells = [headerRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
