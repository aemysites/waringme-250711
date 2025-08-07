/**
 * Trading Banner Component
 * Matches Sky.com's trading banner design
 */
export default function decorate(block) {
  // Get the banner content
  const content = block.querySelector('.default-content-wrapper');
  if (!content) return;

  // Create the trading banner structure
  const banner = document.createElement('div');
  banner.className = 'trading-banner';

  // Extract content from the block
  const title = content.querySelector('h1, h2, h3, h4, h5, h6');
  const description = content.querySelector('p');
  const ctaButton = content.querySelector('a.button, .button a, a[href*="buy"], a[href*="shop"]');
  const secondaryButton = content.querySelector('a:not(.button):not([href*="buy"]):not([href*="shop"])');

  // Build the banner HTML
  banner.innerHTML = `
    <div class="trading-banner-content">
      <div class="trading-banner-text">
        ${title ? `<h2 class="trading-banner-title">${title.textContent}</h2>` : ''}
        ${description ? `<p class="trading-banner-description">${description.textContent}</p>` : ''}
      </div>
      <div class="trading-banner-actions">
        ${ctaButton ? `<a href="${ctaButton.href}" class="trading-banner-cta">${ctaButton.textContent}</a>` : ''}
        ${secondaryButton ? `<a href="${secondaryButton.href}" class="trading-banner-secondary">${secondaryButton.textContent}</a>` : ''}
      </div>
    </div>
  `;

  // Clear the block and add the banner
  block.textContent = '';
  block.appendChild(banner);
} 