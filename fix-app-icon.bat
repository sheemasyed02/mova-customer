@echo off
echo Fixing MOVA App Icon Issue...
echo.

REM Ensure we have the MOVA logo
if exist "assets\images\Mova1.jpg" (
    echo Found MOVA logo source file
    
    REM Create proper icon.png (1024x1024 recommended)
    copy "assets\images\Mova1.jpg" "assets\images\icon.png" >nul
    echo ✓ Updated icon.png (Main app icon)
    
    REM Create adaptive icon for Android
    copy "assets\images\Mova1.jpg" "assets\images\adaptive-icon.png" >nul
    echo ✓ Updated adaptive-icon.png (Android adaptive icon)
    
    REM Create favicon for web
    copy "assets\images\Mova1.jpg" "assets\images\favicon.png" >nul
    echo ✓ Updated favicon.png (Web browser icon)
    
    REM Create splash icon
    copy "assets\images\Mova1.jpg" "assets\images\splash-icon.png" >nul
    echo ✓ Updated splash-icon.png (Splash screen icon)
    
    echo.
    echo ✓ All MOVA app icons updated successfully!
    echo.
    echo Next steps:
    echo 1. Restart: npx expo start --clear
    echo 2. Test on web: http://localhost:8081
    echo 3. For mobile: Install Expo Go and scan QR code
    echo 4. For production: Icons will appear when app is built/published
    echo.
    echo Note: In development, you might not see icon changes immediately.
    echo The icon will appear properly when the app is installed on device.
    
) else (
    echo ERROR: MOVA logo file not found!
    echo Please ensure 'Mova1.jpg' exists in assets/images/
)

echo.
echo Press any key to continue...
pause >nul