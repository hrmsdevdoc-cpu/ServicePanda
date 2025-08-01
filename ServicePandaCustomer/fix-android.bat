@echo off
echo 🔧 Fixing ServicePanda Android Build Issues...

echo.
echo 📁 Creating fonts directory...
mkdir android\app\src\main\assets\fonts 2>nul

echo.
echo 📝 Copying vector icon fonts...
copy node_modules\react-native-vector-icons\Fonts\*.ttf android\app\src\main\assets\fonts\ >nul 2>&1

echo.
echo 🧹 Cleaning build...
call npx react-native clean

echo.
echo 🗑️ Removing node_modules...
rmdir /s /q node_modules 2>nul

echo.
echo 📦 Installing dependencies...
call npm install

echo.
echo 🔧 Cleaning Android...
cd android
call gradlew clean
cd ..

echo.
echo ✅ Android build fix complete!
echo.
echo 🚀 Now try: npm run android

pause