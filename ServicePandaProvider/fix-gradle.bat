@echo off
echo Fixing Gradle wrapper...
cd android
if not exist gradle\wrapper\gradle-wrapper.jar (
    echo Downloading Gradle wrapper...
    powershell -Command "Invoke-WebRequest -Uri 'https://services.gradle.org/distributions/gradle-8.3-bin.zip' -OutFile 'gradle-8.3-bin.zip'"
    powershell -Command "Expand-Archive -Path 'gradle-8.3-bin.zip' -DestinationPath 'gradle-temp'"
    copy gradle-temp\gradle-8.3\lib\gradle-wrapper.jar gradle\wrapper\gradle-wrapper.jar
    rmdir /s /q gradle-temp
    del gradle-8.3-bin.zip
)
echo Gradle wrapper fixed!
cd ..
npm run android














