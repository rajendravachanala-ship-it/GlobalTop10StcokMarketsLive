# Global Top 10 Stock Markets Live Dashboard

A real-time, responsive dashboard displaying the top 10 stock markets by market value with live index data, visual indicators, and market status alerts.

## 🌟 Features

### 📊 Live Market Data
- **Real-time indices** for 10 global stock markets
- Data powered by Yahoo Finance API
- **Auto-refresh** every 60 seconds (manual refresh available)
- **Mock data fallback** when API is unavailable

### 🎨 Visual Indicators
- **Green** - Index up >1% ✅
- **Orange** - Index up 0-1% ⚠️
- **Red** - Index down/negative ❌
- **⭐ Star Badge** - Market is currently closed
- **🚨 Alert Badges** - Flashing alerts for ±2% changes

### 📈 Data Points
Each market card displays:
- Current index value
- Change percentage with trend arrow (📈 📉 ➡️)
- Previous close price
- Daily change in points
- Exchange name & country
- Market open/closed status
- Last updated timestamp

### 10 Global Markets Included
1. **S&P 500** (NYSE, USA)
2. **NASDAQ** (NASDAQ, USA)
3. **STOXX 50** (Euronext, Europe)
4. **Nikkei 225** (JPX, Japan)
5. **Hang Seng** (HKEX, Hong Kong)
6. **Shanghai Composite** (SSE, China)
7. **FTSE 100** (LSE, UK)
8. **BSE SENSEX** (BSE, India)
9. **ASX 200** (ASX, Australia)
10. **Straits Times** (SGX, Singapore)

## 🚀 Quick Start

### Option 1: GitHub Pages (Recommended - Free)
1. Go to your repository **Settings** → **Pages**
2. Set **Source** to "Deploy from a branch"
3. Select **main** branch and **/ (root)**
4. Click **Save**
5. Wait 1-2 minutes for deployment
6. Your live dashboard: `https://rajendravachanala-ship-it.github.io/GlobalTop10StcokMarketsLive/`

### Option 2: Deploy to Netlify (Free)
1. Visit [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub account
4. Select this repository
5. Deploy! Your link: `https://<your-site>.netlify.app/`

### Option 3: Deploy to Vercel (Free)
1. Visit [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import from Git
4. Select this repository
5. Deploy! Your link: `https://<project-name>.vercel.app/`

### Option 4: Local Development
```bash
# Clone the repository
git clone https://github.com/rajendravachanala-ship-it/GlobalTop10StcokMarketsLive.git
cd GlobalTop10StcokMarketsLive

# Open with live server (VS Code)
# Install Live Server extension, right-click index.html → Open with Live Server

# Or use Python
python -m http.server 8000
# Open http://localhost:8000
```

## 📁 File Structure
```
GlobalTop10StcokMarketsLive/
├── index.html          # Main HTML with responsive UI design
├── script.js           # JavaScript for data fetching & real-time updates
├── README.md           # This file
└── .gitignore          # Git ignore patterns
```

## 🔧 Customization

### Add More Markets
Edit `script.js` - Add to the `MARKETS` array:
```javascript
{ symbol: '^INDEX', name: 'Market Name', exchange: 'EXCH', country: 'Country', timezone: 'Timezone' }
```

### Change Refresh Interval
In `script.js`, modify this line:
```javascript
refreshInterval = setInterval(fetchMarketData, 60000); // Change 60000 to your desired milliseconds
```

### Adjust Alert Threshold
In `script.js`, find this line:
```javascript
const showAlert = Math.abs(changePercent) >= 2; // Change 2 to your desired percentage
```

### Modify Colors
In `index.html` CSS section, adjust these values:
```css
/* Green threshold */
if (changePercent > 1) return 'green';

/* Orange threshold */
if (changePercent >= 0 && changePercent <= 1) return 'orange';
```

## 🐛 Troubleshooting

### Dashboard shows mock data instead of live data
- **Cause**: Yahoo Finance API rate limit or network issue
- **Solution**: Wait a few minutes and refresh, or check browser console for errors

### Markets showing as always "closed"
- **Cause**: System timezone not properly detected
- **Solution**: Check browser's timezone settings

### GitHub Pages not updating
- **Cause**: Cache issue
- **Solution**: 
  1. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
  2. Clear browser cache
  3. Try incognito/private mode

### CORS errors in console
- **Cause**: Browser blocking cross-origin requests
- **Solution**: The app uses a public CORS proxy - should work in all modern browsers

## 📊 Market Hours Reference
- **USA (EST)**: 9:30 AM - 4:00 PM
- **Europe (CET)**: 9:00 AM - 5:30 PM
- **Japan (JST)**: 9:00 AM - 3:00 PM
- **Hong Kong (HKT)**: 9:30 AM - 4:00 PM
- **China (CST)**: 9:30 AM - 3:00 PM
- **UK (GMT)**: 8:00 AM - 4:30 PM
- **India (IST)**: 9:15 AM - 3:30 PM
- **Australia (AEDT)**: 10:00 AM - 4:00 PM
- **Singapore (SGT)**: 9:00 AM - 5:00 PM

## 🔗 API References
- **Primary**: Yahoo Finance API (free, no key required)
- **Fallback**: Mock data built-in for reliability

## 💡 Tips
- Use on a large monitor for best experience
- Share your live dashboard link with colleagues
- Add to your browser bookmarks for quick access
- Works perfectly on mobile and tablet devices

## 📄 License
Free to use and modify

## 🤝 Contributing
Feel free to fork, modify, and improve this project!

## 📞 Support
For issues or questions, check the GitHub Issues section of this repository.

---

**Live Dashboard**: Deploy and share your link above! 🚀
