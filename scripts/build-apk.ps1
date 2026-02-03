# Build Release APK Script for Windows

Write-Host "Cleaning implementation..."
npx expo prebuild --platform android --clean

Write-Host "Building Release APK..."
cd android
./gradlew assembleRelease

Write-Host "Build Complete!"
Write-Host "APK should be located at: android/app/build/outputs/apk/release/app-release.apk"
