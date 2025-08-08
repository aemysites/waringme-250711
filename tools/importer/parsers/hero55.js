/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero55)'];

  // 2. 2nd row: background asset (poster image from <video>, if present; else link to video)
  let backgroundAsset = '';
  const video = element.querySelector('video');
  if (video) {
    if (video.poster) {
      // Use <img> element using the video poster (do not clone, create a new <img> with correct src)
      const img = document.createElement('img');
      img.src = video.poster;
      img.alt = video.getAttribute('alt') || '';
      backgroundAsset = img;
    } else if (video.src) {
      // Fallback: if no poster, use a link to the video
      const link = document.createElement('a');
      link.href = video.src;
      link.textContent = 'Background video';
      backgroundAsset = link;
    }
  }

  // 3rd row: text content (title, subtitle, cta) -- none present in this HTML, pass an empty string
  const contentRow = [''];

  // Assemble the table rows as per the required structure
  const cells = [
    headerRow,
    [backgroundAsset],
    contentRow,
  ];

  // Create the block table using WebImporter helper
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
