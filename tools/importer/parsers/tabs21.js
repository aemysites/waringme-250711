/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tab menu and content
  const tabMenu = element.querySelector('.w-tab-menu');
  const tabLinks = tabMenu ? Array.from(tabMenu.querySelectorAll('a')) : [];
  const tabContentContainer = element.querySelector('.w-tab-content');
  const tabPanes = tabContentContainer ? Array.from(tabContentContainer.querySelectorAll('.w-tab-pane')) : [];

  // Build rows: first row is header ['Tabs']
  const rows = [['Tabs']];

  // For each tab, create a row with [label, content]
  for (let i = 0; i < tabLinks.length; i++) {
    // Get tab label
    let label = '';
    const link = tabLinks[i];
    const labelDiv = link.querySelector('div');
    if (labelDiv) {
      label = labelDiv.textContent.trim();
    } else {
      label = link.textContent.trim();
    }
    // Get tab content: use grid if present, else whole pane
    let content = '';
    if (tabPanes[i]) {
      const grid = tabPanes[i].querySelector('.w-layout-grid, .grid-layout');
      content = grid ? grid : tabPanes[i];
    }
    rows.push([label, content]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
