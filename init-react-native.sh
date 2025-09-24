#!/bin/bash

echo "🚀 Initializing React Native Project..."
echo ""

# Check if React Native CLI is installed
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Installing..."
    npm install -g npx
fi

# Initialize React Native project
echo "📱 Creating React Native structure..."

# Create React Native project with minimal setup
npx react-native@latest init OneMomentApp --template react-native-template-typescript --skip-install --directory . --pm npm

# If that fails, try alternative approach
if [ $? -ne 0 ]; then
    echo "🔄 Using alternative setup..."
    
    # Create android folder
    mkdir -p android/app/src/main/java/com/onemoment
    
    # Create ios folder  
    mkdir -p ios/OneMoment
    
    # Create index.js
    cat > index.js << 'EOF'
import {AppRegistry} from 'react-native';
import App from './apps/guest-app/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
EOF

    # Create app.json
    cat > app.json << 'EOF'
{
  "name": "OneMoment",
  "displayName": "OneMoment SuperApp"
}
EOF

    # Create metro.config.js
    cat > metro.config.js << 'EOF'
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {
  resolver: {
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json'],
  },
  watchFolders: [
    './apps',
    './packages',
  ],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
EOF

    echo "✅ Basic structure created!"
fi

echo ""
echo "📦 Installing React Native dependencies..."
npm install react-native@0.72.0 react@18.2.0 --legacy-peer-deps
npm install @react-native-community/cli @react-navigation/native @react-navigation/stack --legacy-peer-deps
npm install react-native-safe-area-context react-native-screens react-native-gesture-handler --legacy-peer-deps
npm install @react-native-async-storage/async-storage --legacy-peer-deps

echo ""
echo "✅ React Native initialized!"
echo ""
echo "Next steps:"
echo "1. For iOS: cd ios && pod install && cd .."
echo "2. For Android: Make sure Android Studio is installed"
echo "3. Run: npm run ios OR npm run android"
