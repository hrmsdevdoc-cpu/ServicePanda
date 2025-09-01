@echo off
echo 🚀 Building ServicePanda for server deployment...
echo.

echo 📦 Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo 🔨 Building server (TypeScript to JavaScript)...
call npm run build:server-js
if %errorlevel% neq 0 (
    echo ❌ Failed to build server
    pause
    exit /b 1
)

echo.
echo ✅ Build completed successfully!
echo.
echo 📁 Your compiled JavaScript files are in the 'server-js' directory
echo 📁 For cPanel deployment, use 'server-js/index.js' as your startup file
echo.
echo 🔧 To test locally, run: npm run start:server
echo.
echo 📋 Next steps for cPanel:
echo    1. Upload the 'server-js' folder to your server
echo    2. Set startup file to 'server-js/index.js'
echo    3. Make sure your .env file is uploaded
echo    4. Run 'npm install --production' on the server
echo.
pause
