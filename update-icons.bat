@echo off
echo Updating MOVA app icons...

if exist "assets\images\movalogo.png" (
    echo Found movalogo.png
    
    copy "assets\images\movalogo.png" "assets\images\icon.png" >nul
    echo Updated icon.png
    
    copy "assets\images\movalogo.png" "assets\images\adaptive-icon.png" >nul
    echo Updated adaptive-icon.png
    
    copy "assets\images\movalogo.png" "assets\images\favicon.png" >nul
    echo Updated favicon.png
    
    copy "assets\images\movalogo.png" "assets\images\splash-icon.png" >nul
    echo Updated splash-icon.png
    
    echo.
    echo All icons updated successfully!
    echo Run: npx expo start --clear
    
) else (
    echo ERROR: movalogo.png not found in assets/images/
    echo Please save the MOVA logo as 'movalogo.png' first
)

pause