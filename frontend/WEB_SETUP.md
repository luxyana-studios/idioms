# 🌐 Expo Web Setup

## ⚡ Quick Start for Web

### 🎯 Commands to Run on Web

**Recommended (Production mode - stable):**

```bash
npm run web
```

**Development mode (with HMR):**

```bash
npm run web-dev
```

### 🚨 Common Mistakes

❌ **DON'T use:**

```bash
npm expo start --web --no-dev  # Wrong: "npm expo" doesn't exist
```

✅ **DO use:**

```bash
npm run web                    # Recommended: Uses package.json script
npx expo start --web --no-dev  # Direct command with npx
```

## � Configuration Files

### Required Files:

- ✅ `metro.config.cjs` - Metro bundler + NativeWind
- ✅ `babel.config.cjs` - Babel configuration
- ✅ `tsconfig.json` - TypeScript configuration
- ✅ `index.js` - Entry point
- ✅ `package.json` - Dependencies and scripts

### Files Removed:

- ❌ `webpack.config.js` - Not needed (Expo 53 uses Metro)
- ❌ `tslib-simple.js` - Not needed (simplified solution)
- ❌ Custom build scripts - Not needed

## 🔧 How It Works

The solution uses `--no-dev` flag to disable HMR (Hot Module Replacement) which was causing conflicts with animation libraries like Moti.

- Multiple tslib dependencies cause conflicts during hot reloads

**Simple Fix:**

- Use `--no-dev` flag to disable HMR for web development
- This runs in production mode but still allows development

## 🔧 Current Configuration

### `package.json` scripts:

- `web`: `expo start --web --no-dev` (recommended)
- `web-dev`: `expo start --web` (development mode with HMR)

### `metro.config.cjs`:

- Clean, minimal configuration
- Only essential web platform support
- No custom tslib aliases needed

## 🌟 Result

✅ Much simpler setup
✅ No custom files needed
✅ No complex build process
✅ Works with all app features
✅ Faster than previous solution

## 📱 Access

Once started, open: **http://localhost:8082**

### 🌐 Access from Other Devices

The server runs on your local network, making it accessible from other devices:

- Find your local IP: `ip addr show | grep "inet 192"`
- Access from other devices: `http://[your-ip]:8082`
- Example: `http://192.168.1.100:8082`
