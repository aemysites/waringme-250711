/* global WebImporter */
export default function parse(element, { document }) {
  // Find the <video> element
  const video = element.querySelector('video');
  let posterImg = null;
  let videoLink = null;
  const cellContent = [];

  if (video) {
    // If there is text content before/after video, include it
    // Collect all significant text content (outside <video>)
    Array.from(element.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        cellContent.push(node.textContent.trim());
      }
    });

    // Add poster image if present
    const posterSrc = video.getAttribute('poster');
    if (posterSrc) {
      posterImg = document.createElement('img');
      posterImg.src = posterSrc;
      posterImg.alt = video.getAttribute('alt') || '';
      cellContent.push(posterImg);
    }
    // Add video link if present
    const videoSrc = video.getAttribute('src');
    if (videoSrc) {
      videoLink = document.createElement('a');
      videoLink.href = videoSrc;
      videoLink.textContent = videoSrc;
      cellContent.push(videoLink);
    }
  }

  // If there is no <video> or no cell content, fallback: include all children
  if (!cellContent.length) {
    cellContent.push(...Array.from(element.childNodes).filter(n => n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.textContent.trim())));
  }

  const cells = [
    ['Embed (embedVideo39)'],
    [cellContent]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
