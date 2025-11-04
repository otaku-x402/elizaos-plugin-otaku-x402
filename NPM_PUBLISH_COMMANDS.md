# Comandi per Pubblicazione NPM - PRONTI ALL'USO

## 🚀 QUICK START - Copia e Incolla

### 1. Login NPM (una volta sola)

```bash
cd KOLSCAN/ELIZA_PLUGIN
npm login
```

### 2. Pubblica su NPM

```bash
npm publish
```

### 3. Verifica Pubblicazione

```bash
npm view @elizaos/plugin-otaku-x402
```

## ✅ TUTTO PRONTO!

Il plugin è configurato e pronto per:

- ✅ **Nome**: `@elizaos/plugin-otaku-x402`
- ✅ **Build**: Compilato in `dist/`
- ✅ **Licenza**: MIT
- ✅ **Repository**: github.com/otaku-x402/elizaos-plugin-otaku-x402
- ✅ **Homepage**: api.otaku-x402.com

## 📋 Dopo NPM Publish

1. **Crea repository GitHub** (se non esiste già):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - ElizaOS KOL Plugin"
   git branch -M main
   git remote add origin https://github.com/otaku-x402/elizaos-plugin-otaku-x402.git
   git push -u origin main
   ```

2. **Registra nel marketplace ElizaOS**:
   - Vai su: https://github.com/elizaos-plugins/registry
   - Fork del repository
   - Aggiungi file `plugins/otaku-x402.json` con:
   ```json
   {
     "name": "@elizaos/plugin-otaku-x402",
     "version": "1.0.0",
     "description": "AI-powered Solana token trading insights",
     "author": "otaku-x402",
     "homepage": "https://api.otaku-x402.com",
     "repository": "https://github.com/otaku-x402/elizaos-plugin-otaku-x402",
     "category": "trading"
   }
   ```
   - Crea Pull Request

## 🔄 Aggiornamenti Futuri

Per pubblicare nuove versioni:

```bash
# Patch (1.0.0 → 1.0.1)
npm version patch
npm publish

# Minor (1.0.1 → 1.1.0)
npm version minor
npm publish

# Major (1.1.0 → 2.0.0)
npm version major
npm publish
```

## 📦 Test Locale Prima di Pubblicare

```bash
# Simula pubblicazione senza pubblicare
npm pack

# Testa installazione locale
npm install ./elizaos-plugin-otaku-x402-1.0.0.tgz
```

---

**PRONTO! Esegui `npm publish` quando sei pronto.**
