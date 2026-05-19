@echo off
cd /d "%~dp0"

echo 道エネWEB版を起動しています...

where npm >nul 2>nul
if errorlevel 1 (
  echo.
  echo Node.js / npm が見つかりません。
  echo Windowsで使う場合は Node.js をインストールしてください。
  echo https://nodejs.org/
  echo.
  pause
  exit /b 1
)

start "道エネWEB版サーバー" cmd /k npm run dev -- --host 127.0.0.1 --port 5173
timeout /t 3 /nobreak >nul
start "" "http://127.0.0.1:5173/web-app.html"
