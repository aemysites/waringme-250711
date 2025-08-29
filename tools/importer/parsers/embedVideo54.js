/* global WebImporter */
export default function parse(element, { document }) {
  // Header row, exactly matching example
  const headerRow = ['Embed (embedVideo54)'];

  // Find the video element
  const video = element.querySelector('video');
  const cellContent = [];

  if (video) {
    // If video has a poster, reference as <img> above link
    const poster = video.getAttribute('poster');
    if (poster) {
      // Use alt if present
      const img = document.createElement('img');
      img.src = poster;
      img.alt = video.getAttribute('alt') || '';
      cellContent.push(img);
    }
    // If there is non-empty text content in the element, include it above or below the image/link
    // Get all non-empty direct text nodes from the element
    const directText = Array.from(element.childNodes)
      .filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim())
      .map(node => {
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        return span;
      });
    if (directText.length) {
      cellContent.push(...directText);
    }
    // Add the video src as a link
    const src = video.getAttribute('src');
    if (src) {
      const link = document.createElement('a');
      link.href = src;
      link.textContent = src;
      cellContent.push(document.createElement('br'));
      cellContent.push(link);
    }
    // Include any text content inside the video element (rare for <video>, but ensure completeness)
    if (video.textContent && video.textContent.trim()) {
      const span = document.createElement('span');
      span.textContent = video.textContent.trim();
      cellContent.push(span);
    }
  } else {
    // If no video, include all non-empty direct text content from the element
    const directText = Array.from(element.childNodes)
      .filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim())
      .map(node => {
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        return span;
      });
    if (directText.length) {
      cellContent.push(...directText);
    } else {
      cellContent.push(''); // Empty cell if no content
    }
  }

  const tableCells = [
    headerRow,
    [cellContent]
  ];

  // Create the block table and replace original element
  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
