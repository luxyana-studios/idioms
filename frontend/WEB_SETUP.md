# 🌐 Expo Web Setup

## ⚡ Quick Start para Web

### 🎯 Opciones para ejecutar en Web

#### Opción 1: Comando completo (recomendado) 🚀

```bash
npm run web-auto
```

- ✅ Build + servidor + abre navegador automáticamente
- ✅ Equivalente a presionar 'w' en Expo pero sin errores

#### Opción 2: Script bash automatizado

```bash
./start-web-production.sh
```

- ✅ Build + servidor + abre navegador automáticamente

#### Opción 3: Paso a paso

```bash
npm run web        # Build la aplicación
npm run web-serve  # Servir + abrir navegador automáticamente
```

#### Opción 4: Manual

```bash
npx expo export -p web
cd dist && python3 -m http.server 3000
# Luego abrir manualmente: http://localhost:3000
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

- Script `web`: Solo build de producción (`expo export -p web`)
- Script `web-serve`: Solo servidor HTTP (sirve dist en puerto 3000)

## 🌟 Resultado

✅ App funciona sin errores de tslib
✅ No hay errores de HMR
✅ Carga completa (no se queda en 99.9%)
✅ Modo producción optimizado
✅ Compatible con todas las funcionalidades de la app

## 📱 Acceso

Una vez iniciado, abre: **http://localhost:3000**
