# MOVA Icon Update Script
# Place your new icon as "new-mova-icon.png" in the assets/images folder
# Then run this script from the assets/images directory

param(
    [string]$SourceImage = "new-mova-icon.png"
)

Write-Host "🎨 MOVA Icon Update Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Check if source image exists
if (-not (Test-Path $SourceImage)) {
    Write-Host "❌ Source image '$SourceImage' not found!" -ForegroundColor Red
    Write-Host "Please place your new MOVA icon as '$SourceImage' in this directory." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Found source image: $SourceImage" -ForegroundColor Green

# Backup existing icons
$backupDir = "backup_icons_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
Write-Host "📦 Creating backup in: $backupDir" -ForegroundColor Yellow

if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

# Backup current icons
$iconsToBackup = @("icon.png", "adaptive-icon.png", "favicon.png", "splash-icon.png")
foreach ($icon in $iconsToBackup) {
    if (Test-Path $icon) {
        Copy-Item $icon "$backupDir\$icon"
        Write-Host "   Backed up: $icon" -ForegroundColor DarkGray
    }
}

# Check if we have image processing capabilities
$hasImageProcessing = $false

# Try to find ImageMagick
if (Get-Command "magick" -ErrorAction SilentlyContinue) {
    $hasImageProcessing = $true
    $processor = "magick"
    Write-Host "✅ Found ImageMagick for image processing" -ForegroundColor Green
}
# Try to find GraphicsMagick
elseif (Get-Command "gm" -ErrorAction SilentlyContinue) {
    $hasImageProcessing = $true
    $processor = "gm"
    Write-Host "✅ Found GraphicsMagick for image processing" -ForegroundColor Green
}

if ($hasImageProcessing) {
    Write-Host "🔄 Processing icons..." -ForegroundColor Cyan
    
    # Generate icons
    $iconSizes = @{
        "icon.png" = "1024x1024"
        "adaptive-icon.png" = "1024x1024"
        "splash-icon.png" = "512x512"
        "favicon.png" = "48x48"
    }
    
    foreach ($iconName in $iconSizes.Keys) {
        $size = $iconSizes[$iconName]
        try {
            if ($processor -eq "magick") {
                & magick $SourceImage -resize $size $iconName
            } else {
                & gm convert $SourceImage -resize $size $iconName
            }
            Write-Host "   ✅ Generated: $iconName ($size)" -ForegroundColor Green
        } catch {
            Write-Host "   ❌ Failed to generate: $iconName" -ForegroundColor Red
        }
    }
    
    Write-Host "🎉 Icon processing complete!" -ForegroundColor Green
} else {
    Write-Host "⚠️  No image processing tool found (ImageMagick/GraphicsMagick)" -ForegroundColor Yellow
    Write-Host "📝 Manual steps required:" -ForegroundColor Cyan
    Write-Host "   1. Resize '$SourceImage' to create:" -ForegroundColor White
    Write-Host "      - icon.png (1024x1024px)" -ForegroundColor Gray
    Write-Host "      - adaptive-icon.png (1024x1024px)" -ForegroundColor Gray
    Write-Host "      - splash-icon.png (512x512px)" -ForegroundColor Gray
    Write-Host "      - favicon.png (48x48px)" -ForegroundColor Gray
    Write-Host "   2. Use online tools like appicon.co or image editors" -ForegroundColor White
}

Write-Host ""
Write-Host "📱 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Test with: expo start --clear" -ForegroundColor White
Write-Host "   2. Check app icon on device" -ForegroundColor White
Write-Host "   3. For production builds, increment version in app.json" -ForegroundColor White

Write-Host ""
Write-Host "✨ Your new MOVA icon should now be ready!" -ForegroundColor Green