#!/bin/bash
# Quick download script for Screen 002

echo "📱 Downloading Screen 002: Phone Login..."

# Create directories
mkdir -p apps/guest-app/screens

# Download main component
curl -s https://raw.githubusercontent.com/whysophie/OneMomentSuperApp/main/apps/guest-app/screens/Screen002_PhoneLogin.tsx \
  -o apps/guest-app/screens/Screen002_PhoneLogin.tsx

# Download test file
curl -s https://raw.githubusercontent.com/whysophie/OneMomentSuperApp/main/apps/guest-app/screens/Screen002_PhoneLogin.test.tsx \
  -o apps/guest-app/screens/Screen002_PhoneLogin.test.tsx

echo "✅ Screen 002 downloaded successfully!"
echo "📍 Location: apps/guest-app/screens/"
echo ""
echo "Next steps:"
echo "1. npm install libphonenumber-js react-native-country-picker-modal"
echo "2. Open in Cursor: cursor apps/guest-app/screens/Screen002_PhoneLogin.tsx"