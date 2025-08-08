/* global WebImporter */
export default function parse(element, { document }) {
  // The Embed block expects a table with header 'Embed' and a cell containing image (poster) and a link to the video/mp4.
  // We must include any text content or child nodes.

  // Find the <video> element
  const video = element.querySelector('video');

  // Prepare an array to collect the cell's content
  const cellContent = [];

  // If the video has a poster, add it as an <img>
  if (video && video.getAttribute('poster')) {
    const img = document.createElement('img');
    img.src = video.getAttribute('poster');
    img.alt = video.getAttribute('alt') || '';
    cellContent.push(img);
  }

  // If the video has a src, add a link to it
  if (video && video.getAttribute('src')) {
    const src = video.getAttribute('src');
    const link = document.createElement('a');
    link.href = src;
    link.textContent = src;
    cellContent.push(link);
  }

  // Add any text nodes or extra content that might be direct children of the element
  Array.from(element.childNodes).forEach((node) => {
    // Only add text nodes or elements that are not the video (to avoid duplication)
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      cellContent.unshift(document.createTextNode(node.textContent));
    } else if (node.nodeType === Node.ELEMENT_NODE && node !== video) {
      cellContent.unshift(node);
    }
  });

  // If there's no content, do not proceed
  if (cellContent.length === 0) return;

  // Construct the Embed block table
  const cells = [
    ['Embed'],
    [cellContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
