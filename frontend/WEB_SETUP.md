# 🌐 Expo Web Setup

## ⚡ Quick Start para Web

### 🎯 Opción Recomendada (Sin errores de HMR/tslib)

```bash
# Método 1: Script automatizado
./start-web-production.sh

# Método 2: NPM script
npm run web

# Método 3: Manual
npx expo export -p web
cd dist && python3 -m http.server 3000
```

### 🚨 Problema Conocido con `expo start --web`

**❌ NO uses:** `expo start` y luego presionar 'w'

**🐛 Problema:** Causa error `Cannot read properties of undefined (reading 'default')` en HMRClient.ts debido a incompatibilidad de tslib con HMR en web.

**✅ Solución:** Usa los comandos de arriba que generan un build de producción sin HMR.

## 🔧 Archivos Modificados

### `metro.config.js`

- Alias para tslib que redirige a `tslib-simple.js`
- Configuración optimizada para web

### `tslib-simple.js`

- Polyfill personalizado que resuelve problemas de compatibilidad de tslib en web
- Exporta todas las funciones de tslib como default export

### `package.json`

- Script `web`: Build de producción + servidor HTTP
- Script `web-dev`: Alias para modo producción (sin desarrollo real)

## 🌟 Resultado

✅ App funciona sin errores de tslib
✅ No hay errores de HMR
✅ Carga completa (no se queda en 99.9%)
✅ Modo producción optimizado
✅ Compatible con todas las funcionalidades de la app

## 📱 Acceso

Una vez iniciado, abre: **http://localhost:3000**
