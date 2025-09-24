#!/bin/bash

echo "🚀 QUICK START OneMoment SuperApp"
echo "================================"
echo ""

# Step 1: Check prerequisites
echo "📋 Step 1: Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found! Please install from: https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js: $(node -v)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found!"
    exit 1
fi
echo "✅ npm: $(npm -v)"

# Step 2: Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 Step 2: Installing dependencies..."
    npm install --legacy-peer-deps
else
    echo ""
    echo "✅ Step 2: Dependencies already installed"
fi

# Step 3: Check platform and provide instructions
echo ""
echo "📱 Step 3: Choose your platform:"
echo ""
echo "================================"
echo "For iOS (Mac only):"
echo "1. Make sure Xcode is installed"
echo "2. Run: cd ios && pod install && cd .."
echo "3. Run: npx react-native run-ios"
echo ""
echo "================================"
echo "For Android:"
echo "1. Make sure Android Studio is installed"
echo "2. Start Android Emulator"
echo "3. Run: npx react-native run-android"
echo ""
echo "================================"
echo "For Web Preview (fastest):"
echo "1. Run: npx react-native-web-server"
echo ""
echo "================================"

# Step 4: Provide test data
echo ""
echo "📝 Test Data:"
echo "- Phone: +1234567890"
echo "- OTP: 123456"
echo "- QR Code: QR_TABLE_1"
echo "- Promo: PASTA20"
echo ""

# Step 5: Optional - start mock backend
echo "🔧 Optional: Mock Backend"
echo "For full functionality, run: ./start-mock-backend.sh"
echo ""

echo "✅ Setup complete! Choose your platform above to start."
