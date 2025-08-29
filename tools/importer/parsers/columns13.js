/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Columns (columns13)'];

  // Find all visible tabpanel containers (each is a 'column')
  const tabPanels = Array.from(element.querySelectorAll(':scope > div[role="tabpanel"]'));

  // Ensure at least one panel exists
  if (tabPanels.length === 0) {
    // Fallback: replace with empty columns block
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      ['']
    ], document);
    element.replaceWith(table);
    return;
  }

  // Build the second row by referencing each <ul> directly for each column
  const secondRow = tabPanels.map((panel) => {
    const ul = panel.querySelector('ul');
    // Defensive: if ul is missing, leave cell empty
    return ul || '';
  });

  const cells = [
    headerRow,
    secondRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}