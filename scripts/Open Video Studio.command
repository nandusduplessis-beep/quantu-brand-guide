#!/bin/bash
# Double-click this file to open TQI Video Studio in your browser.

cd "$(dirname "$0")/.." || exit 1

echo "🎬 Starting TQI Video Studio..."
echo ""

# Pull latest changes quietly
git pull origin main 2>/dev/null

# Install dependencies if needed
npm install --silent 2>/dev/null

# Start the dev server in the background
npm run dev &
SERVER_PID=$!

# Wait for the server to be ready
echo "⏳ Loading..."
for i in {1..30}; do
  if curl -s http://localhost:8080 >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

# Open in browser
open http://localhost:8080/video-studio

echo ""
echo "✅ Video Studio is running!"
echo "📺 If the browser didn't open, go to: http://localhost:8080/video-studio"
echo ""
echo "Close this window to stop the server."

# Keep running until the window is closed
wait $SERVER_PID
