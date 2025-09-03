export default function decorate(block) {
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }

  // Handle trading banner (hero2) functionality
  if (block.classList.contains('hero2')) {
    const tradingBanner = block.querySelector('.trading-banner');
    if (tradingBanner) {
      initializeTradingBanner(tradingBanner);
    }
  }
}

function initializeTradingBanner(banner) {
  const tickerContainer = banner.querySelector('.ticker-container');
  if (!tickerContainer) return;

  // Add smooth scrolling behavior
  tickerContainer.style.animationDuration = '30s';
  
  // Pause animation on hover
  banner.addEventListener('mouseenter', () => {
    tickerContainer.style.animationPlayState = 'paused';
  });
  
  banner.addEventListener('mouseleave', () => {
    tickerContainer.style.animationPlayState = 'running';
  });

  // Optional: Add real-time data updates (mock implementation)
  // In a real implementation, you would fetch data from a financial API
  if (window.location.hostname === 'localhost' || window.location.hostname.includes('dev')) {
    // Only run mock updates in development
    startMockDataUpdates(tickerContainer);
  }
}

function startMockDataUpdates(tickerContainer) {
  const tickerItems = tickerContainer.querySelectorAll('.ticker-item');
  
  setInterval(() => {
    tickerItems.forEach(item => {
      const priceEl = item.querySelector('.stock-price');
      const changeEl = item.querySelector('.stock-change');
      
      if (priceEl && changeEl) {
        // Simulate small price changes
        const currentPrice = parseFloat(priceEl.textContent.replace(/[^\d.-]/g, ''));
        const change = (Math.random() - 0.5) * 0.02; // ±1% change
        const newPrice = currentPrice * (1 + change);
        
        // Update price with slight animation
        priceEl.style.transition = 'color 0.3s ease';
        priceEl.style.color = change > 0 ? '#00ff88' : '#ff4444';
        
        setTimeout(() => {
          priceEl.style.color = '#e0e0e0';
        }, 300);
        
        // Update change indicator
        const changePercent = (change * 100).toFixed(2);
        const changeText = changePercent > 0 ? `+${changePercent}%` : `${changePercent}%`;
        
        changeEl.textContent = changeText;
        changeEl.className = 'stock-change';
        changeEl.classList.add(change > 0 ? 'positive' : 'negative');
      }
    });
  }, 5000); // Update every 5 seconds
}
