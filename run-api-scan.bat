@echo off
title Promoo API Scanner
cd /d "%~dp0"

echo ========================================
echo   Promoo API Scanner
echo ========================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo ERROR: Node.js is not installed or not in PATH.
  pause
  exit /b 1
)

echo Checking if server is running...
curl -s -o nul -w "%%{http_code}" http://localhost:3000/api/v1/health > "%TEMP%\promo_health.txt" 2>nul
set /p HEALTH=<%TEMP%\promo_health.txt
del "%TEMP%\promo_health.txt" 2>nul

if not "%HEALTH%"=="200" (
  echo.
  echo WARNING: Server does not seem to be running on port 3000.
  echo Start it first in another terminal:  npm run dev
  echo.
  set /p CONTINUE="Continue anyway? (y/n): "
  if /i not "%CONTINUE%"=="y" exit /b 1
)

echo.
echo Running API scan...
echo.

call npm run api:scan
set EXIT_CODE=%ERRORLEVEL%

echo.
if %EXIT_CODE%==0 (
  echo Done! Open docs\api-reports\api-scan-report.html in your browser.
) else (
  echo Scan finished with failures. Check docs\api-reports\api-scan-report.html
)
echo.
pause
exit /b %EXIT_CODE%
