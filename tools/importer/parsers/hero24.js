/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must exactly match the example: 'Hero (hero24)'
  const headerRow = ['Hero (hero24)'];

  // --- Background Image Extraction ---
  let bgImageEl = null;
  // Find the media hero block
  const mediaHero = element.querySelector('[data-test-id="media-hero"]');
  if (mediaHero) {
    // Prefer <video> poster as the background, fallback to <img> inside mediaHero
    const video = mediaHero.querySelector('video[poster]');
    if (video && video.poster) {
      const img = document.createElement('img');
      img.src = video.poster;
      img.alt = '';
      bgImageEl = img;
    } else {
      const img = mediaHero.querySelector('img');
      if (img) {
        bgImageEl = img;
      }
    }
  }
  // Fallback: <img> directly under picture
  if (!bgImageEl) {
    const picImg = element.querySelector('picture img');
    if (picImg) bgImageEl = picImg;
  }
  // If still not found, leave blank

  // --- Title, Subheading, CTA Cell Extraction ---
  let contentCell = [];
  // Find the hero content area
  const heroContent = element.querySelector('[data-test-id="deals-hero-content"]');
  if (heroContent) {
    // Heading (h1)
    const h1 = heroContent.querySelector('h1');
    if (h1) contentCell.push(h1);
    // Subheading/paragraph (p)
    const p = heroContent.querySelector('p');
    if (p) contentCell.push(p);
    // CTA: any <a> or <button> (none present here, but for generality)
    const ctas = Array.from(heroContent.querySelectorAll('a,button'));
    if (ctas.length > 0) contentCell.push(...ctas);
  }

  // Defensive: if nothing found, push empty string
  if (!bgImageEl) bgImageEl = '';
  if (contentCell.length === 0) contentCell = [''];

  // Compose table: header, image, content
  const rows = [
    headerRow,
    [bgImageEl],
    [contentCell]
  ];

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
