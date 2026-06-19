# 📱 Apex Bridge Mobile Coding Extension
### Version 3.0 | GODSPEED Ecosystem

**Author:** Rahmann Manzar Herman (Make It All Count LLC)  
**Contact:** rahmaan@apexlifeglobal.com  
**Status:** Production Architecture | Native Implementation Pending

---

## 🎯 The Problem
Developers cannot *truly* code on mobile. Existing solutions are viewers, not workspaces.  
There is no seamless bridge between:  
`Mobile Device → GitHub Sync → VS Code Desktop → AI Orchestration → Live Deploy`

---

## 💡 The Solution
**Apex Bridge** turns a smartphone into a primary coding workstation:

1. **Native Mobile Editor** — React Native + Monaco Editor core, offline-first
2. **Bi-Directional Sync** — Real-time pull/push with three-way conflict resolution
3. **VS Code Desktop Bridge** — Dedicated extension for instant state sync
4. **AI Router** — Smart fallback (Local Llama 3 → Free API → Paid Enterprise)
5. **Apex Governance** — Audit logging for enterprise compliance

---

## 🏗️ Architecture Overview

| Layer | File | Responsibility |
|---|---|---|
| Core Editor | `mobile/editor.tsx` | Monaco/WebView integration |
| Sync Engine | `src/sync.ts` | Three-way merge algorithms |
| Bridge Layer | `src/api.ts` | Apex Bridge REST API |
| AI Router | `src/router.ts` | Context-aware model selection |
| Security Vault | `src/native/crypto-vault.ts` | AES-256 token storage |
| Offline Cache | `src/storage.ts` | WatermelonDB/SQLite manager |
| Publish Hooks | `src/publish.ts` | Vercel / Netlify / Sider deploy |

---

## 📂 File Structure

```
apex-mobile-extension/
├── package.json              # React Native dependencies & scripts
├── extension.json            # VS Code extension manifest
├── src/
│   ├── index.ts              # Extension entry point
│   ├── commands.ts           # VS Code command handlers (Sync, Push)
│   ├── sync.ts               # Git logic & conflict resolution
│   ├── api.ts                # Apex Bridge API integration
│   ├── router.ts             # AI model routing logic
│   ├── publish.ts            # Static site deploy hooks
│   ├── storage.ts            # Offline cache manager
│   └── native/
│       ├── ios-native.ts     # iOS Swift bridge coordination layer
│       ├── android-native.ts # Android Kotlin bridge coordination layer
│       ├── fs-access.ts      # Secure file system access
│       └── crypto-vault.ts   # AES-256 token storage
└── mobile/
    ├── App.tsx               # Main React Native UI
    ├── editor.tsx            # Code editor component
    ├── auth.ts               # OAuth 2.0 GitHub flow
    └── cache.ts              # LocalDB (WatermelonDB/SQLite) setup
```

---

## 🔐 Security

- AES-256 encrypted token vault (device secure enclave / Android Keystore)
- Zero-knowledge sync — tokens never leave the device unencrypted
- OAuth 2.0 GitHub authorization code flow
- Full audit logging via Apex Governance layer
- Zero-trust local networking (loopback-only bridge server)

---

## 🖥️ Local Bridge Server (`src/`)

The existing Node.js bridge server (`src/bridge/ApiBridgeManager.ts`) binds strictly to `127.0.0.1:3000` and exposes:

| Endpoint | Description |
|---|---|
| `GET /api/health` | Liveness check |
| `POST /api/params` | Receives `SystemParameters` and routes the envelope |
| `POST /api/handshake` | Ingests bulk payload, returns mapped endpoint URLs |

Zero-trust middleware (`src/routing/ZeroTrustRouter.ts`) rejects all non-loopback requests with `403 Forbidden`.

---

## 🚀 Getting Started

```bash
# Install server dependencies
npm ci

# Build TypeScript server
npm run build

# Start local bridge server (port 3000)
npm start

# Development mode (ts-node)
npm run dev
```

For the mobile extension, see `apex-mobile-extension/package.json`.
