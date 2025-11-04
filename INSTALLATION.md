# Otaku x402 ElizaOS Plugin - Installation Guide

## Quick Start

### 1. Build the Plugin

```bash
cd ELIZA_PLUGIN
npm install
npm run build
```

This will create the `dist/` folder with compiled JavaScript files.

### 2. Install in Your ElizaOS Project

There are two ways to use this plugin:

#### Option A: Local Development (Recommended for Testing)

1. Copy the entire `ELIZA_PLUGIN` folder to your ElizaOS project
2. In your ElizaOS project, install it as a local dependency:

```bash
npm install ./path/to/ELIZA_PLUGIN
```

#### Option B: Publish to NPM (For Production)

1. Update `package.json` with your npm username
2. Publish the plugin:

```bash
cd ELIZA_PLUGIN
npm publish
```

3. In your ElizaOS project:

```bash
npm install @laurabee19802025/plugin-otaku-x402
```

### 3. Configure Your Character

Create or update your character file (e.g., `characters/kol-trader.character.ts`):

```typescript
import { Character } from '@ai16z/eliza';
import { kolPlugin } from '@laurabee19802025/plugin-otaku-x402';

export const kolTrader: Character = {
    name: 'Otaku x402 Trading Assistant',
    username: 'kol_trader',

    bio: [
        'AI-powered Solana trading assistant',
        'Analyzes real-time Otaku x402 trading data',
        'Provides buy/sell/hold recommendations'
    ],

    plugins: [kolPlugin],

    settings: {
        // Otaku x402 API Configuration
        OTAKU_API_URL: 'https://api.otakux402.so',

        // Optional: X402 Micropayments
        X402_ENABLED: false
    },

    // Add more character configuration as needed
    style: {
        all: [
            'Use data-driven insights',
            'Be concise and clear',
            'Include confidence scores',
            'Always mention risk levels'
        ]
    }
};

export default kolTrader;
```

### 4. Environment Variables

Create a `.env` file in your ElizaOS project root:

```env
# Otaku x402 Plugin Configuration
OTAKU_API_URL=https://api.otakux402.so

# Optional: X402 Micropayments
X402_ENABLED=false
X402_PRICE_PER_REQUEST_USDC=0.001
X402_PAYMENT_ADDRESS=YOUR_SOLANA_WALLET
```

### 5. Start Your Agent

```bash
npm run dev
```

or for production:

```bash
npm start
```

## Usage Examples

Once your agent is running, you can interact with it:

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
• Timeframe: 1h

Reasoning:
Strong buy signal. High volume (156 trades), strong trader interest, and positive momentum.

Contract: `7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr`
```

### Hot Tokens

```
User: "Show me the hottest tokens"

Agent: 🔥 Hot Tokens (Last Hour)

1. $POPCAT
   • Trades: 156
   • Volume: 245.67 SOL
   • Address: `7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr`

2. $BONK
   • Trades: 143
   • Volume: 198.23 SOL
   • Address: `DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263`
...
```

### Top Traders

```
User: "Who are the top traders today?"

Agent: 🏆 Top Traders (Daily)

1. Cented
   • PnL: +82.89 SOL
   • Win Rate: 55.8% (58W/46L)
   • Rank: #1

2. Dior
   • PnL: +76.34 SOL
   • Win Rate: 61.2% (52W/33L)
   • Rank: #2
...
```

## API Endpoints

The plugin uses these endpoints from your Otaku x402 API:

- `GET /api/hot-tokens?timeframe=1h&limit=10` - Trending tokens
- `GET /api/leaderboard?timeframe=daily&limit=10` - Top traders
- `GET /api/traders?limit=10` - Active traders
- `GET /api/trades?limit=100` - Recent trading activity

Make sure your API server is running and accessible at `https://api.otakux402.so`

## Troubleshooting

### Plugin Not Loading

1. Check that the plugin is built: `ls dist/`
2. Verify import path in your character file
3. Check console for errors: `npm run dev`

### API Connection Errors

1. Verify API URL is correct: `https://api.otakux402.so`
2. Test API endpoint manually:
   ```bash
   curl https://api.otakux402.so/hot-tokens?timeframe=1h&limit=10
   ```
3. Check CORS settings if running locally

### TypeScript Errors

1. Ensure you have the correct ElizaOS version:
   ```bash
   npm install @ai16z/eliza@latest
   ```
2. Rebuild the plugin:
   ```bash
   cd ELIZA_PLUGIN
   npm run build
   ```

## Development

### Watch Mode

For active development with auto-recompile:

```bash
npm run dev
```

### Testing

```bash
npm test
```

### Project Structure

```
ELIZA_PLUGIN/
├── src/
│   ├── actions/          # Token analysis and data retrieval
│   ├── providers/        # Market data provider
│   ├── types.ts          # TypeScript definitions
│   └── index.ts          # Plugin export
├── dist/                 # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Next Steps

1. **Customize character personality** - Edit your character file
2. **Add more trading strategies** - Extend the analysis algorithm
3. **Integrate X402 payments** - Enable micropayment monetization
4. **Deploy to production** - Host your agent 24/7

## Support

- Documentation: See [README.md](README.md)
- Issues: Report bugs on GitHub
- API Status: https://api.otakux402.so/health

## License

MIT License - See LICENSE file for details
