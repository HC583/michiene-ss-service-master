#!/bin/zsh
cd "$(dirname "$0")"

URL="http://127.0.0.1:5173/pc-16-9.html"

echo "Starting Michiene SS Service Master PC 16:9..."
echo "$URL"

if ! lsof -nP -iTCP:5173 -sTCP:LISTEN >/dev/null 2>&1; then
  npm run dev -- --host 127.0.0.1 --port 5173 >/tmp/michiene-pc-16-9.log 2>&1 &
  sleep 2
fi

open "$URL"
