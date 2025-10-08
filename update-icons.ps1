# MOVA Logo Update Script
# Run this after saving the new MOVA logo as 'mova-main-logo.png' in assets/images/

Write-Host "Updating MOVA app icons..." -ForegroundColor Green

# Check if the new logo file exists
if (Test-Path "assets\images\mova-main-logo.png") {
    Write-Host "Found mova-main-logo.png" -ForegroundColor Green
    
    # Update all icon files
    Copy-Item "assets\images\mova-main-logo.png" "assets\images\icon.png" -Force
    Write-Host "Updated icon.png" -ForegroundColor Green
    
    Copy-Item "assets\images\mova-main-logo.png" "assets\images\adaptive-icon.png" -Force
    Write-Host "Updated adaptive-icon.png" -ForegroundColor Green
    
    Copy-Item "assets\images\mova-main-logo.png" "assets\images\favicon.png" -Force
    Write-Host "Updated favicon.png" -ForegroundColor Green
    
    Copy-Item "assets\images\mova-main-logo.png" "assets\images\splash-icon.png" -Force
    Write-Host "Updated splash-icon.png" -ForegroundColor Green
    
    Write-Host "All icons updated successfully!" -ForegroundColor Green
    Write-Host "Run npx expo start --clear to see the changes" -ForegroundColor Yellow
    
} else {
    Write-Host "mova-main-logo.png not found in assets/images/" -ForegroundColor Red
    Write-Host "Please save the new MOVA logo as mova-main-logo.png first" -ForegroundColor Yellow
}