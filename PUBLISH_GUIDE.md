# Guida alla Pubblicazione su NPM e ElizaOS Registry

## ✅ Preparazione Completata

Il plugin è stato configurato per la pubblicazione:

- ✅ Nome package: `@elizaos/plugin-otaku-x402`
- ✅ Repository: `https://github.com/otaku-x402/elizaos-plugin-otaku-x402`
- ✅ Licenza MIT aggiunta
- ✅ .npmignore configurato
- ✅ Build completata con successo
- ✅ Compatibilità ElizaOS v1.x

## 📦 Step 1: Pubblicazione su NPM

### Pre-requisiti

1. **Account NPM**: Assicurati di avere un account su https://www.npmjs.com
2. **Login NPM**: Esegui il login da terminale

```bash
cd ELIZA_PLUGIN
npm login
```

Ti verrà chiesto:
- Username
- Password
- Email
- OTP (se hai 2FA abilitato)

### Pubblicazione

Una volta autenticato, pubblica il package:

```bash
npm publish
```

Il comando `prepublishOnly` eseguirà automaticamente `npm run build` prima della pubblicazione.

### Verifica Pubblicazione

Dopo qualche minuto, verifica che il package sia visibile:
- https://www.npmjs.com/package/@elizaos/plugin-otaku-x402

## 🚀 Step 2: Registrazione su ElizaOS Plugin Registry

### Opzione A: Fork e Pull Request (Raccomandato)

1. **Fork del Repository**
   - Vai su https://github.com/elizaos-plugins/registry
   - Clicca "Fork" in alto a destra

2. **Clone del tuo Fork**
   ```bash
   git clone https://github.com/TUO_USERNAME/registry.git
   cd registry
   ```

3. **Aggiungi il tuo Plugin**

   Crea un file nella cartella `plugins/` con il nome `otaku-x402.json`:

   ```json
   {
     "name": "@elizaos/plugin-otaku-x402",
     "version": "1.0.0",
     "description": "AI-powered Solana token trading insights with real-time KOL data analysis",
     "author": "otaku-x402",
     "homepage": "https://api.otaku-x402.com",
     "repository": "https://github.com/otaku-x402/elizaos-plugin-otaku-x402",
     "keywords": [
       "solana",
       "trading",
       "kol",
       "crypto",
       "defi",
       "token-analysis"
     ],
     "category": "trading",
     "compatibility": "v1.x"
   }
   ```

4. **Commit e Push**
   ```bash
   git add plugins/otaku-x402.json
   git commit -m "Add @elizaos/plugin-otaku-x402 to registry"
   git push origin main
   ```

5. **Crea Pull Request**
   - Vai al tuo fork su GitHub
   - Clicca "Contribute" → "Open pull request"
   - Titolo: `Add @elizaos/plugin-otaku-x402 - Solana Trading Insights`
   - Descrizione:
   ```markdown
   ## Plugin: @elizaos/plugin-otaku-x402

   AI-powered Solana token trading insights plugin for ElizaOS agents.

   ### Features
   - Real-time token analysis with BUY/HOLD/SELL recommendations
   - Hot tokens monitoring (1h timeframe)
   - Top trader leaderboard tracking
   - AI-driven trading signals with confidence scores

   ### Links
   - NPM: https://www.npmjs.com/package/@elizaos/plugin-otaku-x402
   - Repository: https://github.com/otaku-x402/elizaos-plugin-otaku-x402
   - Homepage: https://api.otaku-x402.com

   ### Compatibility
   - ElizaOS v1.x ✅

   ### Testing
   Plugin is fully tested and operational. API endpoints verified at https://api.otaku-x402.com/api
   ```

### Opzione B: Issue su GitHub (Alternativa)

Se non vuoi fare un fork, puoi aprire una Issue:

1. Vai su https://github.com/elizaos-plugins/registry/issues
2. Clicca "New Issue"
3. Titolo: `Plugin Submission: @elizaos/plugin-otaku-x402`
4. Body:
   ```markdown
   ## Plugin Information

   - **Name**: @elizaos/plugin-otaku-x402
   - **NPM**: https://www.npmjs.com/package/@elizaos/plugin-otaku-x402
   - **Repository**: https://github.com/otaku-x402/elizaos-plugin-otaku-x402
   - **Homepage**: https://api.otaku-x402.com

   ## Description

   AI-powered Solana token trading insights plugin for ElizaOS agents with real-time KOL data analysis.

   ## Features

   - Token analysis with BUY/HOLD/SELL recommendations
   - Hot tokens monitoring
   - Top trader leaderboard
   - AI-driven trading signals

   ## Compatibility

   ElizaOS v1.x
   ```

## ⏰ Tempistiche

- **NPM Publishing**: Immediato (visibile in pochi minuti)
- **ElizaOS Registry**: La sincronizzazione avviene ogni poche ore
- **Marketplace Visibility**: Entro 24 ore dalla sincronizzazione

## 🔍 Verifica Finale

### Test Installazione

Dopo la pubblicazione su NPM, testa l'installazione:

```bash
mkdir test-install
cd test-install
npm init -y
npm install @elizaos/plugin-otaku-x402
```

Verifica che i file siano presenti in `node_modules/@elizaos/plugin-otaku-x402/dist/`

### Test Import

Crea un file `test.js`:

```javascript
const { kolPlugin } = require('@elizaos/plugin-otaku-x402');
console.log('Plugin loaded:', kolPlugin.name);
console.log('Actions:', kolPlugin.actions.length);
console.log('Providers:', kolPlugin.providers.length);
```

Esegui: `node test.js`

Output atteso:
```
Plugin loaded: kol
Actions: 2
Providers: 1
```

## 📝 Checklist Pre-Pubblicazione

- [x] Package name con prefisso `@elizaos/plugin-`
- [x] Repository GitHub configurato
- [x] LICENSE file presente
- [x] README.md completo
- [x] .npmignore configurato
- [x] Build funzionante (`npm run build`)
- [x] Compatibilità ElizaOS v1.x
- [x] Keywords appropriate
- [x] Homepage e repository URL configurati

## 🎯 Post-Pubblicazione

Dopo la pubblicazione, considera:

1. **GitHub Repository**:
   - Crea il repository `otaku-x402/elizaos-plugin-otaku-x402` su GitHub
   - Push del codice
   - Aggiungi README con badge NPM
   - Configura GitHub releases

2. **Documentation**:
   - Aggiungi esempi d'uso
   - Screenshots/GIF della UI
   - Tutorial video (opzionale)

3. **Community**:
   - Annuncia su Discord di ElizaOS
   - Tweet sul plugin
   - Post su forum/Reddit crypto

4. **Manutenzione**:
   - Monitora issues su GitHub
   - Aggiorna dipendenze regolarmente
   - Rilascia nuove versioni con `npm version patch/minor/major`

## 🆘 Troubleshooting

**Errore: 403 Forbidden durante npm publish**
- Verifica di aver fatto login: `npm whoami`
- Assicurati che il package name non sia già preso
- Controlla che `publishConfig.access` sia `"public"`

**Package non appare nel registry ElizaOS**
- Attendi la prossima sincronizzazione (ogni poche ore)
- Verifica che il nome inizi con `@elizaos/plugin-`
- Controlla che sia pubblicato su NPM

**Build error durante prepublishOnly**
- Esegui `npm run build` manualmente per vedere l'errore
- Verifica TypeScript configuration
- Assicurati che tutte le dipendenze siano installate

## 📞 Supporto

- ElizaOS Discord: https://discord.gg/elizaos
- NPM Support: https://www.npmjs.com/support
- GitHub Issues: https://github.com/otaku-x402/elizaos-plugin-otaku-x402/issues

---

**Ready to Publish!** 🚀

Segui gli step sopra per pubblicare il plugin su NPM e registrarlo nel marketplace ElizaOS.
