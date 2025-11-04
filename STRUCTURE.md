# KOL ElizaOS Plugin - Structure & Overview

## Plugin Architecture

```
ELIZA_PLUGIN/
├── src/
│   ├── actions/
│   │   ├── analyzeToken.ts          # AI token analysis action
│   │   └── getKOLData.ts            # Market data retrieval action
│   ├── providers/
│   │   └── kolProvider.ts           # Real-time market data provider
│   ├── types.ts                     # TypeScript type definitions
│   └── index.ts                     # Main plugin export
├── package.json                     # NPM package configuration
├── tsconfig.json                    # TypeScript configuration
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── example-character.ts             # Example Eliza character using the plugin
├── README.md                        # Full documentation
└── STRUCTURE.md                     # This file
```

## Core Components

### 1. Actions

#### `analyzeToken.ts`
**Purpose**: AI-powered token analysis with BUY/HOLD/SELL recommendations

**Triggers**:
- "Should I buy $SYMBOL?"
- "Analyze token ADDRESS"
- "Check $TOKEN"
- "Token recommendation"

**Algorithm**:
1. Fetches hot tokens, leaderboard, and recent trades
2. Calculates 3 metrics:
   - Volume Score (0-100)
   - Trader Interest Score (0-100)
   - Momentum Score (0-100)
3. Generates overall score and recommendation
4. Assesses risk level (LOW/MEDIUM/HIGH)

**Output**: Formatted analysis with confidence, metrics, and reasoning

---

#### `getKOLData.ts`
**Purpose**: Retrieve and format market data from KOL API

**Triggers**:
- "Show hot tokens"
- "Top traders today"
- "Leaderboard"
- "Recent trades"

**Data Types**:
- Hot Tokens (1h timeframe)
- Leaderboard (daily/weekly/monthly)
- Active Traders
- Recent Trading Activity

**Output**: Formatted lists with key metrics

---

### 2. Providers

#### `kolProvider.ts`
**Purpose**: Automatically provides market context to the AI agent

**Data Fetched**:
- Top 10 hot tokens (1h)
- Top 10 traders (daily leaderboard)
- Top 10 active traders
- Market summary

**Refresh**: On every agent interaction

---

### 3. Types (`types.ts`)

**Main Interfaces**:
- `HotToken` - Trending token data
- `LeaderboardTrader` - Trader rankings
- `Trader` - Trader profile
- `TokenActivity` - Trade statistics
- `TradingSignal` - AI recommendation
- `X402PaymentConfig` - Micropayment settings
- `KOLAPIConfig` - API configuration

---

## Data Flow

```
User Message
    ↓
ElizaOS Agent
    ↓
kolProvider (fetches context) → KOL API
    ↓
Action (analyzeToken or getKOLData) → KOL API
    ↓
AI Processing & Formatting
    ↓
Response to User
```

---

## API Integration

### Endpoints Used

| Endpoint | Purpose | Params |
|----------|---------|---------|
| `/api/hot-tokens` | Get trending tokens | `?timeframe=1h&limit=10` |
| `/api/leaderboard` | Get top traders | `?timeframe=daily&limit=10` |
| `/api/traders` | Get active traders | `?limit=10` |
| `/api/trades` | Get recent trades | `?limit=100` |

### Data Sources

All data scraped from **otakux402.so**:
- Trading activity: Every 60 seconds
- Leaderboard: Every 5 minutes (configurable)
- Token addresses: Via Helius RPC
- Real-time updates

---

## X402 Micropayments

### Concept
X402 is a protocol for AI agent micropayments using the HTTP 402 status code ("Payment Required").

### Flow
1. Agent makes API request
2. Server returns HTTP 402 with price
3. Agent creates Solana transaction (USDC payment)
4. Agent resends request with payment proof
5. Server validates and returns data

### Configuration
```typescript
{
    enabled: true,
    price_per_request_usdc: 0.001,  // $0.001 per request
    payment_address: "SOLANA_WALLET",
    accepted_tokens: ["USDC", "SOL"]
}
```

### Use Cases
- **Data Providers**: Monetize API access
- **AI Agents**: Pay for premium data
- **Marketplaces**: Trade signals and analysis

---

## Trading Signal Algorithm

### 1. Volume Score
```javascript
volumeScore = (token.total_volume_sol / maxVolume) * 100
```
**Weight**: 33.3%

### 2. Trader Interest Score
```javascript
traderScore = Math.min((token.trade_count / 100) * 100, 100)
```
**Weight**: 33.3%

### 3. Momentum Score
```javascript
recentTrades = trades.filter(t => t.token_address === token.token_address)
momentumScore = Math.min((recentTrades.length / 20) * 100, 100)
```
**Weight**: 33.3%

### Overall Signal
```javascript
overallScore = (volumeScore + traderScore + momentumScore) / 3

if (overallScore >= 70) return 'BUY'
else if (overallScore >= 40) return 'HOLD'
else return 'SELL'
```

### Risk Assessment
- **HIGH RISK**: < 10 trades
- **MEDIUM RISK**: 10-50 trades
- **LOW RISK**: > 50 trades

---

## Installation & Usage

### 1. Install Package
```bash
npm install plugin-otaku-x402
```

### 2. Add to Character
```typescript
import { kolPlugin } from 'plugin-otaku-x402';

export const character = {
    name: "Trading Agent",
    plugins: [kolPlugin],
    settings: {
        KOL_API_URL: "https://api.otakux402.so"
    }
};
```

### 3. Configure Environment
```env
KOL_API_URL=https://api.otakux402.so
X402_ENABLED=false
```

---

## Example Interactions

### Token Analysis
```
User: "Should I buy $BONK?"

Agent: 📊 Token Analysis: $BONK

🟢 Recommendation: BUY
Confidence: 87%

Metrics:
• Volume Score: 92/100
• Trader Interest: 85/100
• Momentum: 84/100
• Risk Level: LOW

Market Data:
• Total Trades: 156
• Volume: 245.67 SOL ($46,028.22)

Reasoning:
Strong buy signal. High volume, strong trader interest, positive momentum.
```

### Market Data
```
User: "Show me hot tokens"

Agent: 🔥 Hot Tokens (Last Hour)

1. $POPCAT
   • Trades: 156
   • Volume: 245.67 SOL

2. $BONK
   • Trades: 143
   • Volume: 198.23 SOL
...
```

---

## Development

### Build
```bash
npm run build
```

### Dev Mode
```bash
npm run dev
```

### Test
```bash
npm test
```

---

## Future Enhancements

1. **X402 Implementation** - Full micropayment support
2. **Historical Analysis** - Backtesting and performance tracking
3. **Multi-Timeframe** - 5m, 15m, 1h, 4h, 1d analysis
4. **ML Models** - Advanced prediction algorithms
5. **Portfolio Tracking** - Monitor holdings and P&L
6. **Webhooks** - Real-time signal notifications
7. **Risk Management** - Position sizing and stop-loss suggestions

---

## License & Disclaimer

**License**: MIT

**Disclaimer**: This plugin provides AI-generated analysis for educational purposes. Not financial advice. DYOR before investing. Cryptocurrency trading carries significant risk.

---

## Support

- GitHub Issues: Report bugs
- Documentation: See README.md
- Contact: support@kol.ai

Built for ElizaOS and Solana communities 🚀
