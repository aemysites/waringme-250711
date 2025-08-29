/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header must match the example
  const headerRow = ['Columns (columns50)'];

  // 2. Get the parent container holding all features
  const featureContainer = element.querySelector(':scope > div');
  if (!featureContainer) {
    // If structure is different, fallback to element itself
    return; // Cannot parse if features are missing
  }

  // 3. Get all features as direct children
  const featureDivs = Array.from(featureContainer.querySelectorAll(':scope > div'));
  if (featureDivs.length === 0) return;

  // 4. Each feature is a column: collect all images and text (label under image)
  const columns = featureDivs.map((featureDiv) => {
    // Each feature has a child box (may be nested)
    // Find the flex container
    const flex = featureDiv.querySelector('.flex__Flex-sc-1r1ee79-0');
    if (!flex) return featureDiv; // fallback: entire featureDiv
    // In flex, find the image and any text
    const imgs = Array.from(flex.querySelectorAll('img'));
    const ps = Array.from(flex.querySelectorAll('p'));
    // If both image and text present: put both in one cell
    if (imgs.length && ps.length) {
      return [imgs[0], ps[0]];
    }
    // If only image present
    if (imgs.length) {
      return imgs[0];
    }
    // If only text present
    if (ps.length) {
      return ps[0];
    }
    // Fallback: use flex
    return flex;
  });

  // 5. Construct table rows: first row header, then one row with all columns
  const tableCells = [
    headerRow,
    columns
  ];

  // 6. Create table and replace element
  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
