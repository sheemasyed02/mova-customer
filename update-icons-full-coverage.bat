@echo off
echo Processing MOVA logo for optimal icon display...

if exist "assets\images\mova-main-logo.png" (
    echo Found mova-main-logo.png
    
    REM Copy the logo to all icon locations with proper naming
    copy "assets\images\mova-main-logo.png" "assets\images\icon.png" >nul
    echo Updated icon.png (Main app icon - 1024x1024)
    
    copy "assets\images\mova-main-logo.png" "assets\images\adaptive-icon.png" >nul
    echo Updated adaptive-icon.png (Android adaptive - 1024x1024)
    
    copy "assets\images\mova-main-logo.png" "assets\images\favicon.png" >nul
    echo Updated favicon.png (Web favicon - any size)
    
    copy "assets\images\mova-main-logo.png" "assets\images\splash-icon.png" >nul
    echo Updated splash-icon.png (Splash screen - any size)
    
    echo.
    echo ✓ All icons updated for complete coverage!
    echo ✓ App.json configured for 'cover' resize mode
    echo ✓ LoadingScreen configured for larger icon display
    echo.
    echo Next steps:
    echo 1. Run: npx expo start --clear
    echo 2. Test on web: http://localhost:8081 or 8082
    echo 3. Check mobile app icons
    
) else (
    echo ERROR: mova-main-logo.png not found in assets/images/
    echo Please ensure the MOVA logo is saved as 'mova-main-logo.png'
)

pause