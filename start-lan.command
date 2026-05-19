#!/bin/zsh
cd "$(dirname "$0")"

echo "Starting Michiene SS Service Master for the local network..."
echo "People on the same Wi-Fi can open:"
echo "http://192.168.1.7:5173/web-app.html"
echo ""

npm run dev -- --host 0.0.0.0 --port 5173
