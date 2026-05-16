@echo off
setlocal

cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js / npm が見つかりません。
  echo https://nodejs.org/ からNode.jsを入れてください。
  pause
  exit /b 1
)

if not exist node_modules (
  echo 初回準備中です。少し待ってください...
  npm install
  if errorlevel 1 (
    echo 準備に失敗しました。
    pause
    exit /b 1
  )
)

start "Michiene SS Mobile Preview" cmd /k "npm run dev -- --host 127.0.0.1 --port 5173"
timeout /t 3 /nobreak >nul
start http://127.0.0.1:5173/mobile-app.html
