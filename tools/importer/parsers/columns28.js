/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct child columns in the grid
  const columns = Array.from(element.querySelectorAll(':scope > *'));

  // Create the table manually so the header th can have a colspan
  const table = document.createElement('table');
  const headerTr = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = 'Columns (columns28)';
  th.colSpan = columns.length > 0 ? columns.length : 1;
  headerTr.appendChild(th);
  table.appendChild(headerTr);

  // Content row
  const contentTr = document.createElement('tr');
  columns.forEach(col => {
    const td = document.createElement('td');
    td.appendChild(col);
    contentTr.appendChild(td);
  });
  table.appendChild(contentTr);

  element.replaceWith(table);
}
