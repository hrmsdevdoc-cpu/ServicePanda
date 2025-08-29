@echo off
echo Fixing conflicting resources...

REM Remove conflicting drawable resources
if exist "android\app\src\main\res\drawable-mdpi\node_modules_reactnativepaper_src_assets_backchevron.png" (
    echo Removing conflicting backchevron.png...
    del "android\app\src\main\res\drawable-mdpi\node_modules_reactnativepaper_src_assets_backchevron.png"
)

if exist "android\app\src\main\res\drawable-hdpi\node_modules_reactnativepaper_src_assets_backchevron.png" (
    echo Removing conflicting backchevron.png (hdpi)...
    del "android\app\src\main\res\drawable-hdpi\node_modules_reactnativepaper_src_assets_backchevron.png"
)

if exist "android\app\src\main\res\drawable-xhdpi\node_modules_reactnativepaper_src_assets_backchevron.png" (
    echo Removing conflicting backchevron.png (xhdpi)...
    del "android\app\src\main\res\drawable-xhdpi\node_modules_reactnativepaper_src_assets_backchevron.png"
)

if exist "android\app\src\main\res\drawable-xxhdpi\node_modules_reactnativepaper_src_assets_backchevron.png" (
    echo Removing conflicting backchevron.png (xxhdpi)...
    del "android\app\src\main\res\drawable-xxhdpi\node_modules_reactnativepaper_src_assets_backchevron.png"
)

REM Remove any other conflicting React Native Paper assets
for /d %%d in (android\app\src\main\res\drawable-*) do (
    if exist "%%d\node_modules_reactnativepaper_src_assets_*.png" (
        echo Removing conflicting React Native Paper assets from %%d...
        del "%%d\node_modules_reactnativepaper_src_assets_*.png"
    )
)

echo Resource cleanup complete!
pause
