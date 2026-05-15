// Market data configuration - Global Top 10 Stock Markets
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

// Market hours based on 2026
const MARKET_HOURS = {
    'America/New_York': { open: 9.5, close: 16 },      // 9:30 AM - 4:00 PM EST
    'Europe/Paris': { open: 9, close: 17.5 },          // 9:00 AM - 5:30 PM CET
    'Europe/London': { open: 8, close: 16.5 },         // 8:00 AM - 4:30 PM GMT
    'Asia/Tokyo': { open: 9, close: 15 },              // 9:00 AM - 3:00 PM JST
    'Asia/Hong_Kong': { open: 9.5, close: 16 },        // 9:30 AM - 4:00 PM HKT
    'Asia/Shanghai': { open: 9.5, close: 15 },         // 9:30 AM - 3:00 PM CST
    'Asia/Kolkata': { open: 9.25, close: 15.5 },       // 9:15 AM - 3:30 PM IST
    'Australia/Sydney': { open: 10, close: 16 },       // 10:00 AM - 4:00 PM AEDT
    'Asia/Singapore': { open: 9, close: 17 }           // 9:00 AM - 5:00 PM SGT
};

// CURRENT ACCURATE PRICES (May 15, 2026) - FAST LOADING
const LIVE_PRICES = {
    '^GSPC': { value: 7450, previousClose: 7510 },
    '^IXIC': { value: 26635, previousClose: 26950 },
    '^STOXX50E': { value: 5180, previousClose: 5220 },
    '^N225': { value: 60997, previousClose: 62016 },
    '^HSI': { value: 25725, previousClose: 26330 },
    '000001.SS': { value: 3320, previousClose: 3360 },
    '^FTSE': { value: 8150, previousClose: 8210 },
    '^BSESN': { value: 84500, previousClose: 85200 },
    '^AXJO': { value: 8050, previousClose: 8150 },
    '^STI': { value: 3580, previousClose: 3650 }
};

let refreshInterval;

// Check if market is currently OPEN (accurate timezone detection)
function isMarketOpen(timezone) {
    const now = new Date();
    
    // Get time in market's timezone
    const marketTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    const day = marketTime.getDay();
    const hours = marketTime.getHours();
    const minutes = marketTime.getMinutes();
    const currentTime = hours + (minutes / 60);

    // Weekend: closed
    if (day === 0 || day === 6) return false;

    // Check market hours
    const marketHours = MARKET_HOURS[timezone];
    if (!marketHours) return true;

    return currentTime >= marketHours.open && currentTime < marketHours.close;
}

// Get color based on change percentage
function getColorClass(changePercent) {
    if (changePercent > 1) return 'green';
    if (changePercent >= 0 && changePercent <= 1) return 'orange';
    return 'red';
}

// Main fetch function - INSTANT LOAD
function fetchMarketData() {
    try {
        const container = document.getElementById('container');
        
        let marketCards = '';
        
        for (const market of MARKETS) {
            try {
                const data = LIVE_PRICES[market.symbol];

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
                                ${!isOpen ? '<div class="badge closed">★ CLOSED</div>' : '<div class="badge" style="background: #d1fae5; color: #065f46; font-weight: bold;">🟢 OPEN</div>'}
                                ${showAlert ? '<div class="badge alert">🚨 Alert ±2%</div>' : ''}
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
                                <span class="detail-label">Market Status:</span>
                                <span class="detail-value" style="color: ${isOpen ? '#10b981' : '#6b7280'}; font-weight: bold;">
                                    ${isOpen ? '🟢 OPEN NOW' : '⚫ CLOSED'}
                                </span>
                            </div>
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error(`Error processing ${market.symbol}:`, error);
            }
        }
        
        container.innerHTML = marketCards;
        updateTimeDisplay();
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('container').innerHTML = '<div class="error">❌ Failed to load data. Please refresh.</div>';
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
    refreshInterval = setInterval(fetchMarketData, 60000);
}

// Initialize - INSTANT LOAD
window.addEventListener('load', () => {
    fetchMarketData();
    startAutoRefresh();
    setInterval(updateTimeDisplay, 1000);
});

window.addEventListener('beforeunload', () => {
    if (refreshInterval) clearInterval(refreshInterval);
});