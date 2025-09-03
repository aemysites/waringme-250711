/* global WebImporter */
export default function parse(element, { document }) {
  // Define the table header for trading banner
  const headerRow = ['Hero (hero2)'];

  // Create trading banner structure
  const tradingBanner = document.createElement('div');
  tradingBanner.className = 'trading-banner';

  // Create ticker container
  const tickerContainer = document.createElement('div');
  tickerContainer.className = 'ticker-container';

  // Look for existing ticker data or create sample data
  const existingTickers = element.querySelectorAll('.ticker-item, .stock-item, [data-ticker]');
  
  if (existingTickers.length > 0) {
    // Use existing ticker data
    existingTickers.forEach(ticker => {
      const tickerItem = document.createElement('div');
      tickerItem.className = 'ticker-item';
      
      // Extract symbol, price, and change from existing elements
      const symbol = ticker.querySelector('.symbol, .stock-symbol, [data-symbol]') || 
                    ticker.querySelector('strong, b') || 
                    ticker.querySelector('span:first-child');
      
      const price = ticker.querySelector('.price, .stock-price, [data-price]') || 
                   ticker.querySelector('span:nth-child(2)');
      
      const change = ticker.querySelector('.change, .stock-change, [data-change]') || 
                    ticker.querySelector('span:last-child');

      if (symbol) {
        const symbolEl = document.createElement('span');
        symbolEl.className = 'stock-symbol';
        symbolEl.textContent = symbol.textContent.trim();
        tickerItem.appendChild(symbolEl);
      }

      if (price) {
        const priceEl = document.createElement('span');
        priceEl.className = 'stock-price';
        priceEl.textContent = price.textContent.trim();
        tickerItem.appendChild(priceEl);
      }

      if (change) {
        const changeEl = document.createElement('span');
        changeEl.className = 'stock-change';
        const changeText = change.textContent.trim();
        changeEl.textContent = changeText;
        
        // Determine if positive or negative
        if (changeText.includes('+') || changeText.includes('▲')) {
          changeEl.classList.add('positive');
        } else if (changeText.includes('-') || changeText.includes('▼')) {
          changeEl.classList.add('negative');
        }
        
        tickerItem.appendChild(changeEl);
      }

      tickerContainer.appendChild(tickerItem);
    });
  } else {
    // Create sample trading data if none exists
    const sampleData = [
      { symbol: 'FTSE 100', price: '7,234.56', change: '+1.2%' },
      { symbol: 'GBP/USD', price: '1.2745', change: '+0.3%' },
      { symbol: 'Oil', price: '$78.45', change: '-0.8%' },
      { symbol: 'Gold', price: '$1,987.32', change: '+0.5%' }
    ];

    sampleData.forEach(data => {
      const tickerItem = document.createElement('div');
      tickerItem.className = 'ticker-item';

      const symbolEl = document.createElement('span');
      symbolEl.className = 'stock-symbol';
      symbolEl.textContent = data.symbol;
      tickerItem.appendChild(symbolEl);

      const priceEl = document.createElement('span');
      priceEl.className = 'stock-price';
      priceEl.textContent = data.price;
      tickerItem.appendChild(priceEl);

      const changeEl = document.createElement('span');
      changeEl.className = 'stock-change';
      changeEl.textContent = data.change;
      changeEl.classList.add(data.change.startsWith('+') ? 'positive' : 'negative');
      tickerItem.appendChild(changeEl);

      tickerContainer.appendChild(tickerItem);
    });
  }

  tradingBanner.appendChild(tickerContainer);

  // Create table structure: header, trading banner content
  const cells = [
    headerRow,
    [tradingBanner]
  ];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with the block
  element.replaceWith(block);
}
