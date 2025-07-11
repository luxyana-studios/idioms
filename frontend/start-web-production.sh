#!/bin/bash

echo "🚀 Starting Expo web production build..."

# Kill any existing servers
pkill -f "python3 -m http.server" || true

# Use npm scripts for consistency
echo "📦 Building and starting web app..."
npm run web-auto
