# MOVA App Icon Update Script
# This script will update all app icons with the new MOVA logo

Write-Host "Updating MOVA App Icons..." -ForegroundColor Green

# Create backup of existing icons
Write-Host "Creating backup of existing icons..." -ForegroundColor Yellow
$backupDir = "assets\images\backup"
if (!(Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force
}

# Backup existing icons
Copy-Item "assets\images\icon.png" "$backupDir\icon-backup.png" -Force -ErrorAction SilentlyContinue
Copy-Item "assets\images\adaptive-icon.png" "$backupDir\adaptive-icon-backup.png" -Force -ErrorAction SilentlyContinue
Copy-Item "assets\images\favicon.png" "$backupDir\favicon-backup.png" -Force -ErrorAction SilentlyContinue
Copy-Item "assets\images\splash-icon.png" "$backupDir\splash-icon-backup.png" -Force -ErrorAction SilentlyContinue

Write-Host "Backup completed!" -ForegroundColor Green

# Check if the new MOVA logo exists
$newLogoPath = "assets\images\mova-new-logo.png"

if (Test-Path $newLogoPath) {
    Write-Host "Found new MOVA logo. Updating app icons..." -ForegroundColor Green
    
    # Copy the new logo as the main icon
    Copy-Item $newLogoPath "assets\images\icon.png" -Force
    
    # Copy for adaptive icon (Android)
    Copy-Item $newLogoPath "assets\images\adaptive-icon.png" -Force
    
    # Copy for favicon (Web)
    Copy-Item $newLogoPath "assets\images\favicon.png" -Force
    
    # Copy for splash icon
    Copy-Item $newLogoPath "assets\images\splash-icon.png" -Force
    
    Write-Host "✅ App icons updated successfully!" -ForegroundColor Green
    Write-Host "New icons applied:" -ForegroundColor Cyan
    Write-Host "  - Main app icon (1024x1024)" -ForegroundColor White
    Write-Host "  - Android adaptive icon" -ForegroundColor White
    Write-Host "  - Web favicon" -ForegroundColor White
    Write-Host "  - Splash screen icon" -ForegroundColor White
    
} else {
    Write-Host "❌ Error: New MOVA logo not found at $newLogoPath" -ForegroundColor Red
    Write-Host "Please save your new logo image as 'mova-new-logo.png' in the assets/images folder" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔄 To see the changes:" -ForegroundColor Cyan
Write-Host "1. Stop the Expo development server (Ctrl+C)" -ForegroundColor White
Write-Host "2. Clear Expo cache: npx expo start --clear" -ForegroundColor White
Write-Host "3. Reload your app" -ForegroundColor White
Write-Host ""
Write-Host "📱 For production builds, run:" -ForegroundColor Cyan
Write-Host "   npx expo prebuild --clean" -ForegroundColor White