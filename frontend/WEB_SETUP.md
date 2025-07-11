# 🌐 Expo Web Setup

## ⚡ Quick Start for Web

### 🎯 Options to Run on Web

#### Option 1: Complete command (recommended) 🚀

```bash
npm run web-auto
```

- ✅ Build + server + opens browser automatically
- ✅ Equivalent to pressing 'w' in Expo but without errors

#### Option 2: Automated bash script

```bash
./start-web-production.sh
```

- ✅ Build + server + opens browser automatically

#### Option 3: Step by step

```bash
npm run web        # Build the application
npm run web-serve  # Serve + open browser automatically
```

#### Option 4: Manual

```bash
npx expo export -p web
cd dist && python3 -m http.server 3000
# Then open manually: http://localhost:3000
```

### 🚨 Known Issue with `expo start --web`

**❌ DON'T use:** `expo start` and then press 'w'

**🐛 Problem:** Causes error `Cannot read properties of undefined (reading 'default')` in HMRClient.ts due to tslib incompatibility with HMR on web.

**✅ Solution:** Use the commands above that generate a production build without HMR.

## 🔧 Modified Files

### `metro.config.cjs`

- Tslib aliases that redirect to `tslib-simple.js`
- Web-optimized configuration

### `tslib-simple.js`

- Custom polyfill that resolves tslib compatibility issues on web
- Exports all tslib functions as default export

### `package.json`

- Script `web`: Production build only (`expo export -p web`)
- Script `web-serve`: HTTP server only (serves dist on port 3000)
- Script `web-auto`: Complete workflow (build + serve + auto-open)

## 🌟 Result

✅ App works without tslib errors
✅ No HMR errors
✅ Loads completely (doesn't freeze at 99.9%)
✅ Optimized production mode
✅ Compatible with all app features
✅ Browser opens automatically

## 📱 Access

Once started, open: **http://localhost:3000**

### 🌐 Access from Other Devices

The server runs on `0.0.0.0:3000`, making it accessible from any device on the same network:

- Find your local IP: `ip addr show | grep "inet 192"`
- Access from other devices: `http://[your-ip]:3000`
- Example: `http://192.168.1.100:3000`
