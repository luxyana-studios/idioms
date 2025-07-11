#!/bin/bash

echo "🚀 Starting Expo web production build..."

# Kill any existing servers
pkill -f "python3 -m http.server" || true
pkill -f "serve dist" || true

# Build the app
echo "📦 Building web app..."
npx expo export -p web

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🌐 Starting web server on http://localhost:3000"
    echo "📱 Opening browser automatically..."
    cd dist
    # Start server in background and open browser
    python3 -m http.server 3000 &
    SERVER_PID=$!
    sleep 3
    # Try to open browser (works on most Linux systems)
    xdg-open http://localhost:3000 2>/dev/null || echo "📱 Open http://localhost:3000 in your browser"
    echo "🔄 Press Ctrl+C to stop the server"
    wait $SERVER_PID
else
    echo "❌ Build failed!"
    exit 1
fi
