@echo off
echo Updating MOVA app icons...

if exist "assets\images\mova-main-logo.png" (
    echo Found mova-main-logo.png
    
    copy "assets\images\mova-main-logo.png" "assets\images\icon.png" >nul
    echo Updated icon.png
    
    copy "assets\images\mova-main-logo.png" "assets\images\adaptive-icon.png" >nul
    echo Updated adaptive-icon.png
    
    copy "assets\images\mova-main-logo.png" "assets\images\favicon.png" >nul
    echo Updated favicon.png
    
    copy "assets\images\mova-main-logo.png" "assets\images\splash-icon.png" >nul
    echo Updated splash-icon.png
    
    echo.
    echo All icons updated successfully!
    echo Run: npx expo start --clear
    
) else (
    echo ERROR: mova-main-logo.png not found in assets/images/
    echo Please save the new MOVA logo as 'mova-main-logo.png' first
)

pause