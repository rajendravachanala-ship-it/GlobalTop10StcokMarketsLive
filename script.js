// Market data configuration
const MARKETS = [
    { symbol: '^GSPC', name: 'S&P 500', exchange: 'NYSE', country: 'USA', timezone: 'America/New_York' },
    { symbol: '^IXIC', name: 'NASDAQ', exchange: 'NASDAQ', country: 'USA', timezone: 'America/New_York' },
    { symbol: '^STOXX50E', name: 'STOXX 50', exchange: 'Euronext', country: 'Europe', timezone: 'Europe/Paris' },
    { symbol: '^N225', name: 'Nikkei 225', exchange: 'JPX', country: 'Japan', timezone: 'Asia/Tokyo' },
    { symbol: '^HSI', name: 'Hang Seng', exchange: 'HKEX', country: 'Hong Kong', timezone: 'Asia/Hong_Kong' },
    { symbol: '000001.SS', name: 'Shanghai Composite', exchange: 'SSE', country: 'China', timezone: 'Asia/Shanghai' },
    { symbol: '^FTSE', name: 'FTSE 100', exchange: 'LSE', country: 'UK', timezone: 'Europe/London' },
    { symbol: '^BSESN', name: 'BSE SENSEX', exchange: 'BSE', country: 'India', timezone: 'Asia/Kolkata' },
    { symbol: '^AXJO', name: 'ASX 200', exchange: 'ASX', country: 'Australia', timezone: 'Australia/Sydney' },
    { symbol: '^STI', name: 'Straits Times', exchange: 'SGX', country: 'Singapore', timezone: 'Asia/Singapore' }
];

// Market hours (opening and closing times in local timezone)
const MARKET_HOURS = {
    'America/New_York': { open: 9.5, close: 16 },      // 9:30 AM - 4:00 PM
    'Europe/Paris': { open: 9, close: 17.5 },          // 9:00 AM - 5:30 PM
    'Europe/London': { open: 8, close: 16.5 },         // 8:00 AM - 4:30 PM
    'Asia/Tokyo': { open: 9, close: 15 },              // 9:00 AM - 3:00 PM
    'Asia/Hong_Kong': { open: 9.5, close: 16 },        // 9:30 AM - 4:00 PM
    'Asia/Shanghai': { open: 9.5, close: 15 },         // 9:30 AM - 3:00 PM
    'Asia/Kolkata': { open: 9.25, close: 15.5 },       // 9:15 AM - 3:30 PM
    'Australia/Sydney': { open: 10, close: 16 },       // 10:00 AM - 4:00 PM
    'Asia/Singapore': { open: 9, close: 17 }           // 9:00 AM - 5:00 PM
};

let refreshInterval;

// Mock data as fallback
const MOCK_DATA = {
    '^GSPC': { value: 5432.10, previousClose: 5387.45 },
    '^IXIC': { value: 17589.50, previousClose: 17521.30 },
    '^STOXX50E': { value: 4523.20, previousClose: 4501.15 },
    '^N225': { value: 28945.50, previousClose: 28812.70 },
    '^HSI': { value: 17234.60, previousClose: 17156.80 },
    '000001.SS': { value: 3087.45, previousClose: 3068.20 },
    '^FTSE': { value: 7687.90, previousClose: 7654.30 },
    '^BSESN': { value: 77845.50, previousClose: 77456.20 },
    '^AXJO': { value: 7654.30, previousClose: 7598.45 },
    '^STI': { value: 3456.78, previousClose: 3421.34 }
};

// Check if market is currently open
function isMarketOpen(timezone) {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        weekday: 'long',
        hour12: false
    });
    
    const parts = formatter.formatToParts(now);
    const weekday = parts.find(p => p.type === 'weekday')?.value;
    const hour = parseInt(parts.find(p => p.type === 'hour')?.value);
    const minute = parseInt(parts.find(p => p.type === 'minute')?.value);
    
    // Weekend is closed
    if (weekday === 'Saturday' || weekday === 'Sunday') return false;
    
    const hours = MARKET_HOURS[timezone];
    if (!hours) return true;
    
    const currentTime = hour + (minute / 60);
    return currentTime >= hours.open && currentTime < hours.close;
}

// Get color based on change percentage
function getColorClass(changePercent) {
    if (changePercent > 1) return 'green';
    if (changePercent >= 0 && changePercent <= 1) return 'orange';
    return 'red';
}

// Fetch market data from API
async function fetchMarketData() {
    try {
        const container = document.getElementById('container');
        container.innerHTML = '<div class="loading">📊 Loading market data...</div>';
        
        let marketCards = '';
        
        for (const market of MARKETS) {
            try {
                // Try to fetch real data
                const response = await fetch(
                    `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${market.symbol}?modules=price`,
                    { signal: AbortSignal.timeout(5000) }
                );
                
                let data;
                if (response.ok) {
                    const json = await response.json();
                    const result = json.quoteSummary.result[0].price;
                    data = {
                        value: result.regularMarketPrice.raw,
                        previousClose: result.regularMarketPreviousClose.raw,
                        currency: result.currency
                    };
                } else {
                    // Use mock data as fallback
                    data = {
                        value: MOCK_DATA[market.symbol].value,
                        previousClose: MOCK_DATA[market.symbol].previousClose,
                        currency: 'USD'
                    };
                }
                
                const changeValue = data.value - data.previousClose;
                const changePercent = (changeValue / data.previousClose) * 100;
                const colorClass = getColorClass(changePercent);
                const isOpen = isMarketOpen(market.timezone);
                const showAlert = Math.abs(changePercent) >= 2;
                
                marketCards += `
                    <div class="market-card ${colorClass}">
                        <div class="market-header">
                            <div>
                                <div class="market-name">${market.name}</div>
                                <div style="font-size: 0.85em; color: #6b7280; margin-top: 3px;">${market.country}</div>
                            </div>
                            <div class="market-badges">
                                ${!isOpen ? '<div class="badge closed">★ Closed</div>' : ''}
                                ${showAlert ? '<div class="badge alert">🚨 Alert</div>' : ''}
                            </div>
                        </div>
                        
                        <div class="market-value">${data.value.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</div>
                        
                        <div class="market-change">
                            <div class="change-percent ${changePercent >= 0 ? 'positive' : 'negative'}">
                                ${changePercent >= 0 ? '📈' : '📉'} 
                                ${Math.abs(changePercent).toFixed(2)}%
                            </div>
                            <div class="change-points" style="color: ${changePercent >= 0 ? '#10b981' : '#ef4444'};">
                                ${changePercent >= 0 ? '+' : ''}${changeValue.toFixed(2)}
                            </div>
                        </div>
                        
                        <div class="market-details">
                            <div class="detail-row">
                                <span class="detail-label">Previous Close:</span>
                                <span class="detail-value">${data.previousClose.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Exchange:</span>
                                <span class="exchange">${market.exchange}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Status:</span>
                                <span class="detail-value" style="color: ${isOpen ? '#10b981' : '#6b7280'};">
                                    ${isOpen ? '🟢 Open' : '⚫ Closed'}
                                </span>
                            </div>
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error(`Error fetching data for ${market.symbol}:`, error);
                // Use mock data if fetch fails
                const data = MOCK_DATA[market.symbol];
                const changeValue = data.value - data.previousClose;
                const changePercent = (changeValue / data.previousClose) * 100;
                const colorClass = getColorClass(changePercent);
                const isOpen = isMarketOpen(market.timezone);
                const showAlert = Math.abs(changePercent) >= 2;
                
                marketCards += `
                    <div class="market-card ${colorClass}">
                        <div class="market-header">
                            <div>
                                <div class="market-name">${market.name}</div>
                                <div style="font-size: 0.85em; color: #6b7280; margin-top: 3px;">${market.country}</div>
                            </div>
                            <div class="market-badges">
                                ${!isOpen ? '<div class="badge closed">★ Closed</div>' : ''}
                                ${showAlert ? '<div class="badge alert">🚨 Alert</div>' : ''}
                            </div>
                        </div>
                        
                        <div class="market-value">${data.value.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</div>
                        
                        <div class="market-change">
                            <div class="change-percent ${changePercent >= 0 ? 'positive' : 'negative'}">
                                ${changePercent >= 0 ? '📈' : '📉'} 
                                ${Math.abs(changePercent).toFixed(2)}%
                            </div>
                            <div class="change-points" style="color: ${changePercent >= 0 ? '#10b981' : '#ef4444'};">
                                ${changePercent >= 0 ? '+' : ''}${changeValue.toFixed(2)}
                            </div>
                        </div>
                        
                        <div class="market-details">
                            <div class="detail-row">
                                <span class="detail-label">Previous Close:</span>
                                <span class="detail-value">${data.previousClose.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Exchange:</span>
                                <span class="exchange">${market.exchange}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Status:</span>
                                <span class="detail-value" style="color: ${isOpen ? '#10b981' : '#6b7280'};">
                                    ${isOpen ? '🟢 Open' : '⚫ Closed'}
                                </span>
                            </div>
                        </div>
                    </div>
                `;
            }
        }
        
        container.innerHTML = marketCards;
        updateTimeDisplay();
    } catch (error) {
        console.error('Error fetching market data:', error);
        document.getElementById('container').innerHTML = '<div class="error">Failed to load market data. Please try again.</div>';
    }
}

// Update time display
function updateTimeDisplay() {
    const now = new Date();
    const timeString = now.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    document.getElementById('timeDisplay').textContent = '🕐 ' + timeString;
}

// Auto-refresh data every 60 seconds
function startAutoRefresh() {
    if (refreshInterval) clearInterval(refreshInterval);
    refreshInterval = setInterval(fetchMarketData, 60000); // 60 seconds
}

// Initialize on page load
window.addEventListener('load', () => {
    fetchMarketData();
    startAutoRefresh();
    setInterval(updateTimeDisplay, 1000); // Update time every second
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (refreshInterval) clearInterval(refreshInterval);
});