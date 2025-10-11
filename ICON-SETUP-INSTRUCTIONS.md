# MOVA App Icon Setup Instructions

## 📱 How to Update Your App Icon with the New MOVA Logo

### Step 1: Save Your Logo Image
1. Save the MOVA logo image you provided as `mova-new-logo.png` in the `assets/images/` folder
2. Make sure the image is high resolution (preferably 1024x1024 pixels or larger)
3. Ensure it's in PNG format for best compatibility

### Step 2: Run the Update Script
Open PowerShell in your project directory and run:
```powershell
.\update-mova-icons.ps1
```

### Step 3: Alternative Manual Method
If you prefer to do it manually:

1. **Replace the main app icon:**
   - Copy your logo image to `assets/images/icon.png`

2. **Replace the Android adaptive icon:**
   - Copy your logo image to `assets/images/adaptive-icon.png`

3. **Replace the web favicon:**
   - Copy your logo image to `assets/images/favicon.png`

4. **Replace the splash screen icon:**
   - Copy your logo image to `assets/images/splash-icon.png`

### Step 4: Clear Cache and Restart
```bash
# Stop the current Expo server (Ctrl+C)
# Then run:
npx expo start --clear
```

### Step 5: For Production Builds
```bash
npx expo prebuild --clean
```

## 🎨 Current App Configuration

Your app.json is already configured correctly:
- **Main Icon**: `./assets/images/icon.png`
- **Android Adaptive Icon**: `./assets/images/adaptive-icon.png` 
- **Web Favicon**: `./assets/images/favicon.png`
- **Splash Icon**: `./assets/images/splash-icon.png`
- **Background Color**: `#0A2F35` (MOVA dark teal)

## ✅ What Will Happen

After updating, your new MOVA logo will appear:
- 📱 As the app icon on device home screens
- 🤖 As the Android adaptive icon
- 🌐 As the web favicon in browsers
- 🚀 In the splash screen when app loads

## 🔧 Icon Specifications

- **Main Icon**: 1024x1024 PNG (iOS/Android)
- **Adaptive Icon**: 1024x1024 PNG (Android foreground)
- **Favicon**: Any size PNG (Web)
- **Splash Icon**: Any size PNG (Loading screen)

## 🎯 Pro Tips

1. **High Resolution**: Use 1024x1024 or higher for crisp quality
2. **Square Format**: Icons work best in square format
3. **Clear Background**: PNG format with transparency if needed
4. **Brand Consistency**: Your new logo maintains MOVA's professional look
5. **Test on Device**: Always test on actual devices after updating

---

Your new MOVA logo with the car icon and modern typography will give your app a professional, branded appearance that users will recognize! 🚗✨