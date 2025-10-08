# MOVA Logo Update Instructions

## Steps to Update App Icons with New MOVA Logo:

### 1. Save the New Logo Image
- Save the attached MOVA logo image as `mova-main-logo.png` in the `assets/images/` folder
- The image should be square (1024x1024 pixels) for best results
- Make sure it has the dark teal background with white MOVA text and car icon

### 2. Run the Following Commands to Update All Icons:

```powershell
# Navigate to the project directory
cd d:\MovaCustomer

# Copy the new logo to all icon locations
copy "assets\images\mova-main-logo.png" "assets\images\icon.png"
copy "assets\images\mova-main-logo.png" "assets\images\adaptive-icon.png"
copy "assets\images\mova-main-logo.png" "assets\images\favicon.png"
copy "assets\images\mova-main-logo.png" "assets\images\splash-icon.png"

# Clear Expo cache and restart
npx expo start --clear
```

### 3. Files That Will Be Updated:
- `icon.png` - Main app icon (1024x1024)
- `adaptive-icon.png` - Android adaptive icon
- `favicon.png` - Web browser favicon
- `splash-icon.png` - Splash screen icon

### 4. App Configuration (Already Set):
The app.json is already configured to use these icon files:
- Main icon: `./assets/images/icon.png`
- Adaptive icon: `./assets/images/adaptive-icon.png`
- Favicon: `./assets/images/favicon.png`
- Splash icon: `./assets/images/splash-icon.png`

### 5. Background Colors:
The splash screen background is set to `#2D9B8E` (MOVA teal) which matches your logo perfectly.