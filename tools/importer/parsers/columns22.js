/* global WebImporter */
export default function parse(element, { document }) {
  // Find #masthead-footer (support extra wrapper)
  let footerWrapper = element;
  if (!footerWrapper.matches('#masthead-footer')) {
    footerWrapper = element.querySelector('#masthead-footer');
  }
  if (!footerWrapper) return;

  // Get <footer>
  const footer = footerWrapper.querySelector('footer[data-test-id="footer"]');
  if (!footer) return;

  // Get sections
  const logoWrap = footer.querySelector('.logo-wrapper');
  const linksWrap = footer.querySelector('.footer-links-wrapper');
  const countrySwitch = footer.querySelector('.country-switch-wrapper');

  // Table header
  const headerRow = ['Columns (columns22)'];

  // Row 1: left = logo/copyright, right = links
  const row1 = [logoWrap ? logoWrap : '', linksWrap ? linksWrap : ''];
  // Row 2: left = empty, right = country switch only
  const row2 = ['', countrySwitch ? countrySwitch : ''];

  // Compose table
  const cells = [headerRow, row1, row2];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
