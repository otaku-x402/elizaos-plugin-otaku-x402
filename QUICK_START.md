# KOL ElizaOS Plugin - Quick Start Guide

## ✅ Plugin Status: READY FOR USE

Il plugin ElizaOS per KOLSCAN è completo e funzionante!

### 🎯 Cosa fa questo plugin

Il plugin permette agli agenti AI di ElizaOS di:
- **Analizzare token Solana** con raccomandazioni BUY/HOLD/SELL
- **Monitorare hot tokens** in tempo reale
- **Tracciare top trader** e loro performance
- **Fornire segnali di trading** basati su dati KOL

### 📊 API Endpoints Verificati

✅ **Health Check**: `https://api.otaku-x402.com/api/health`
✅ **Hot Tokens**: `https://api.otaku-x402.com/api/hot-tokens`
✅ **Leaderboard**: `https://api.otaku-x402.com/api/leaderboard`
✅ **Traders**: `https://api.otaku-x402.com/api/traders`

### 🚀 Installazione Rapida

#### 1. Build del Plugin

```bash
cd ELIZA_PLUGIN
npm install
npm run build
```

#### 2. Configurazione Minima

Crea un file `.env` nella tua installazione ElizaOS:

```env
KOL_API_URL=https://api.otaku-x402.com/api
```

#### 3. Aggiungi al tuo Character

```typescript
import { kolPlugin } from './ELIZA_PLUGIN/dist/index.js';

export const character = {
    name: "KOL Trading Bot",
    plugins: [kolPlugin],
    settings: {
        KOL_API_URL: "https://api.otaku-x402.com/api"
    }
};
```

### 🧪 Test del Plugin

Verifica che gli endpoint funzionino:

```bash
cd ELIZA_PLUGIN
node test-plugin.js
```

Output atteso:
```
✅ Status: 200
📊 Data count: 10
Top 3 Hot Tokens:
1. $ZEC - 55 trades, 129.46 SOL
2. $PRETZEL - 24 trades, 24.57 SOL
3. $BATTLEZ - 28 trades, 81.26 SOL
```

### 💬 Esempi di Utilizzo

Una volta che l'agente è attivo, puoi interagire così:

**Analisi Token:**
```
User: "Should I buy $BONK?"
```

**Hot Tokens:**
```
User: "Show me the hottest tokens right now"
```

**Top Traders:**
```
User: "Who are the best traders today?"
```

### 📂 Struttura del Plugin

```
ELIZA_PLUGIN/
├── dist/                    ✅ File compilati (pronti all'uso)
├── src/
│   ├── actions/
│   │   ├── analyzeToken.ts  ✅ Analisi AI dei token
│   │   └── getKOLData.ts    ✅ Recupero dati di mercato
│   ├── providers/
│   │   └── kolProvider.ts   ✅ Provider dati in tempo reale
│   ├── types.ts             ✅ Type definitions
│   └── index.ts             ✅ Export principale
├── package.json
├── test-plugin.js           ✅ Script di test
├── INSTALLATION.md          📖 Guida installazione completa
├── README.md                📖 Documentazione completa
└── QUICK_START.md          📖 Questo file
```

### 🔧 File di Configurazione

**`.env.example`** - Template variabili d'ambiente:
```env
KOL_API_URL=https://api.otaku-x402.com/api
X402_ENABLED=false
```

**`example-character.ts`** - Esempio di character configurato:
- Bio e personalità dell'agente
- Esempi di messaggi
- Configurazione plugin
- Topics e style guide

### 📝 Prossimi Passi

1. **Testa localmente** - Usa `test-plugin.js` per verificare la connettività
2. **Integra in ElizaOS** - Segui la guida in `INSTALLATION.md`
3. **Personalizza il character** - Modifica `example-character.ts` per il tuo use case
4. **Deploy in produzione** - Pubblica il plugin su NPM (opzionale)

### 🎨 Personalizzazione

Il plugin è altamente personalizzabile:

- **Algoritmo di analisi**: Modifica `analyzeToken.ts` per cambiare i criteri
- **Formattazione output**: Personalizza le funzioni `format*` in `getKOLData.ts`
- **Provider data**: Aggiungi nuove fonti in `kolProvider.ts`
- **Thresholds**: Cambia i livelli di BUY/HOLD/SELL (attualmente 70/40)

### ⚠️ Note Importanti

1. **URL API**: Assicurati di usare `https://api.otaku-x402.com/api` (con `/api`)
2. **Rate Limiting**: L'API potrebbe avere limiti di richieste
3. **Endpoint `/trades`**: Attualmente non disponibile, ma non critico per il funzionamento
4. **DYOR**: Il plugin fornisce analisi AI, non consigli finanziari

### 🐛 Troubleshooting

**Plugin non si carica:**
```bash
# Ricompila il plugin
npm run build
```

**Errori di connessione API:**
```bash
# Testa gli endpoint
curl https://api.otaku-x402.com/api/health
```

**Errori TypeScript:**
```bash
# Aggiorna le dipendenze
npm install @ai16z/eliza@latest
```

### 📞 Supporto

- **Documentazione completa**: Vedi `README.md`
- **Guida installazione**: Vedi `INSTALLATION.md`
- **Test degli endpoint**: Esegui `node test-plugin.js`

### ✨ Features Implementate

✅ Token analysis con AI scoring
✅ Hot tokens monitoring (1h timeframe)
✅ Leaderboard trader tracking
✅ Real-time market data provider
✅ BUY/HOLD/SELL recommendations
✅ Risk level assessment
✅ Confidence scoring
✅ Multiple trigger phrases
✅ Formatted markdown output
✅ Error handling robusto

### 🚧 Features Pianificate

⏳ X402 micropayments implementation
⏳ Multi-timeframe analysis (5m, 15m, 1h, 4h, 1d)
⏳ Historical data backtesting
⏳ Advanced ML prediction models
⏳ Portfolio tracking
⏳ Webhook notifications

---

**Il plugin è pronto per essere utilizzato!** 🎉

Per iniziare: `npm install && npm run build`
