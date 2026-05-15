#!/bin/zsh
cd "$(dirname "$0")"

echo "Starting Michiene SS Service Master..."
echo "Open this URL in your browser:"
echo "http://127.0.0.1:5173/"
echo ""

npm run dev -- --host 127.0.0.1
