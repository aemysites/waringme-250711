/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block name
  const headerRow = ['Columns (columns42)'];

  // Find the ticker item container
  const ul = element.querySelector('ul');
  let cellsRow = [];
  if (ul) {
    const items = Array.from(ul.children);
    cellsRow = items.map(li => {
      // Each ticker li contains an icon SVG and text content
      const box = li.querySelector('div.box__Box-sc-1i8zs0c-0');
      if (!box) return '';
      // Get the icon SVG (div with svg inside)
      const iconDiv = box.querySelector('div[class*=sc-iqziPC]');
      // Get the text (span with inner div)
      const textSpan = box.querySelector('span');
      // Compose array of existing elements, omitting extra <div> wrapper
      const cellContent = [];
      if (iconDiv) cellContent.push(iconDiv);
      if (textSpan) cellContent.push(textSpan);
      return cellContent;
    });
  }
  // Guarantee that at least one cell is present
  if (cellsRow.length === 0) {
    cellsRow = [''];
  }
  // Build the block table
  const tableData = [
    headerRow,
    cellsRow
  ];
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
