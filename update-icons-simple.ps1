# MOVA App Icon Update Script
Write-Host "Updating MOVA App Icons..." -ForegroundColor Green

# Create backup directory
$backupDir = "assets\images\backup"
if (!(Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force
}

# Create backup of existing icons
Write-Host "Creating backup..." -ForegroundColor Yellow
Copy-Item "assets\images\icon.png" "$backupDir\icon-backup.png" -Force -ErrorAction SilentlyContinue
Copy-Item "assets\images\adaptive-icon.png" "$backupDir\adaptive-icon-backup.png" -Force -ErrorAction SilentlyContinue

# Instructions for manual update
Write-Host ""
Write-Host "INSTRUCTIONS TO UPDATE YOUR MOVA LOGO:" -ForegroundColor Cyan
Write-Host "1. Save your new MOVA logo as 'mova-new-logo.png' in assets/images/" -ForegroundColor White
Write-Host "2. Copy it to replace the following files:" -ForegroundColor White
Write-Host "   - assets/images/icon.png" -ForegroundColor Yellow
Write-Host "   - assets/images/adaptive-icon.png" -ForegroundColor Yellow
Write-Host "   - assets/images/favicon.png" -ForegroundColor Yellow
Write-Host "   - assets/images/splash-icon.png" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Then restart Expo with: npx expo start --clear" -ForegroundColor Green
Write-Host ""
Write-Host "Your MOVA logo will then appear as the app icon!" -ForegroundColor Cyan