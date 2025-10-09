# MOVA Logo Update Script
# Run this after saving the new MOVA logo as 'movalogo.png' in assets/images/

Write-Host "Updating MOVA app icons..." -ForegroundColor Green

# Check if the new logo file exists
if (Test-Path "assets\images\movalogo.png") {
    Write-Host "Found movalogo.png" -ForegroundColor Green
    
    # Update all icon files
    Copy-Item "assets\images\movalogo.png" "assets\images\icon.png" -Force
    Write-Host "Updated icon.png" -ForegroundColor Green
    
    Copy-Item "assets\images\movalogo.png" "assets\images\adaptive-icon.png" -Force
    Write-Host "Updated adaptive-icon.png" -ForegroundColor Green
    
    Copy-Item "assets\images\movalogo.png" "assets\images\favicon.png" -Force
    Write-Host "Updated favicon.png" -ForegroundColor Green
    
    Copy-Item "assets\images\movalogo.png" "assets\images\splash-icon.png" -Force
    Write-Host "Updated splash-icon.png" -ForegroundColor Green
    
    Write-Host "All icons updated successfully!" -ForegroundColor Green
    Write-Host "Run npx expo start --clear to see the changes" -ForegroundColor Yellow
    
} else {
    Write-Host "movalogo.png not found in assets/images/" -ForegroundColor Red
    Write-Host "Please save the new MOVA logo as movalogo.png first" -ForegroundColor Yellow
}