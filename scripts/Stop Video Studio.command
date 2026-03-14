#!/bin/bash
# Double-click this file to stop TQI Video Studio.

pkill -f "vite.*quantu-brand-guide" 2>/dev/null
pkill -f "node.*quantu-brand-guide" 2>/dev/null

echo "🛑 Video Studio stopped."
echo "You can close this window."
