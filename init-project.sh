#!/bin/bash

# 🚀 OneMoment SuperApp - Project Initialization Script
# This script sets up the complete monorepo structure with Module Federation

echo "🚀 Starting OneMoment SuperApp initialization..."

# Create main structure
echo "📁 Creating project structure..."
mkdir -p apps/guest-app
mkdir -p apps/waiter-app
mkdir -p apps/kitchen-app
mkdir -p apps/admin-app
mkdir -p packages/shared-ui
mkdir -p packages/api-client
mkdir -p packages/auth
mkdir -p services/restaurants-service
mkdir -p services/hotels-service
mkdir -p services/translator-service
mkdir -p services/esim-service

# Initialize Turborepo
echo "📦 Initializing Turborepo..."
cat > package.json << 'EOF'
{
  "name": "onemoment-superapp",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,md}\"",
    "type-check": "turbo run type-check"
  },
  "devDependencies": {
    "turbo": "latest",
    "prettier": "latest",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.48.0",
    "husky": "^8.0.3",
    "lint-staged": "^14.0.1"
  }
}
EOF

# Create turbo.json
cat > turbo.json << 'EOF'
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "lint": {},
    "type-check": {}
  }
}
EOF

# Initialize Guest App
echo "📱 Setting up Guest App..."
cd apps/guest-app

cat > package.json << 'EOF'
{
  "name": "@onemoment/guest-app",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "test": "jest",
    "lint": "eslint .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.72.6",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/native-stack": "^6.9.17",
    "react-native-safe-area-context": "^4.6.3",
    "react-native-screens": "^3.22.0",
    "zustand": "^4.4.1",
    "@tanstack/react-query": "^5.0.0",
    "zod": "^3.22.2",
    "@callstack/repack": "^3.5.0"
  }
}
EOF

# Create webpack.config.js for Module Federation
cat > webpack.config.mjs << 'EOF'
import * as Repack from '@callstack/repack';

export default (env) => {
  const {
    mode = 'development',
    context = Repack.getDirname(import.meta.url),
    entry = './index.js',
    platform = process.env.PLATFORM,
    minimize = mode === 'production',
    devServer = undefined,
    bundleFilename = undefined,
    sourceMapFilename = undefined,
    assetsPath = undefined,
    reactNativePath = process.env.REACT_NATIVE_PATH,
  } = env;

  if (!platform) {
    throw new Error('Missing platform');
  }

  return {
    mode,
    devtool: false,
    context,
    entry: {
      app: entry,
    },
    resolve: {
      ...Repack.getResolveOptions(platform, { reactNativePath }),
    },
    output: {
      clean: true,
      hashFunction: 'xxhash64',
      path: Repack.getOutputPath(context, platform),
      filename: 'index.bundle',
      chunkFilename: '[name].chunk.bundle',
      publicPath: Repack.getPublicPath({ platform, devServer }),
      globalObject: 'this',
    },
    optimization: {
      minimize,
      chunkIds: 'named',
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          include: [
            /node_modules(.*[/\\])+react-native/,
            /node_modules(.*[/\\])+@react-native/,
            /node_modules(.*[/\\])+@react-navigation/,
            /node_modules(.*[/\\])+react-freeze/,
            /node_modules(.*[/\\])+expo/,
            /node_modules(.*[/\\])+@expo/,
          ],
          use: 'babel-loader',
        },
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              plugins:
                devServer && devServer.hmr
                  ? ['module:react-refresh/babel']
                  : undefined,
            },
          },
        },
        Repack.getAssetRule({ platform }),
      ],
    },
    plugins: [
      new Repack.RepackPlugin({
        context,
        mode,
        platform,
        devServer,
        output: {
          bundleFilename,
          sourceMapFilename,
          assetsPath,
        },
      }),
      new Repack.plugins.ModuleFederationPluginV2({
        name: 'OneMomentHost',
        filename: 'remoteEntry.js',
        exposes: {
          './Navigation': './src/navigation/NavigationContainer',
          './Auth': './src/auth/AuthProvider',
          './UI': './src/shared/UIKit',
        },
        shared: {
          react: {
            singleton: true,
            eager: true,
            requiredVersion: '18.2.0',
          },
          'react-native': {
            singleton: true,
            eager: true,
            requiredVersion: '0.72.0',
          },
          zustand: {
            singleton: true,
            requiredVersion: '4.4.0',
          },
        },
      }),
    ],
  };
};
EOF

# Create TypeScript config with strict mode
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "lib": ["es2017"],
    "jsx": "react-native",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "useUnknownInCatchVariables": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "allowUnusedLabels": false,
    "allowUnreachableCode": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@screens/*": ["./src/screens/*"],
      "@utils/*": ["./src/utils/*"],
      "@types/*": ["./src/types/*"]
    }
  },
  "exclude": ["node_modules", "babel.config.js", "metro.config.js", "jest.config.js"]
}
EOF

# Go back to root
cd ../..

# Create shared UI package
echo "🎨 Creating shared UI package..."
cd packages/shared-ui

cat > package.json << 'EOF'
{
  "name": "@onemoment/shared-ui",
  "version": "0.0.1",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.72.6"
  }
}
EOF

cd ../..

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
build/
dist/
*.bundle

# React Native
.expo/
*.jsbundle
ios/Pods/
android/.gradle/
android/app/build/
android/build/

# Misc
.DS_Store
*.pem
.env*.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Turborepo
.turbo/
EOF

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "✅ OneMoment SuperApp initialized successfully!"
echo ""
echo "📱 To start development:"
echo "   npm run dev"
echo ""
echo "🚀 Next steps:"
echo "   1. cd apps/guest-app && npx react-native init . --template react-native-template-typescript"
echo "   2. Configure SuperTokens authentication"
echo "   3. Set up Hasura GraphQL"
echo "   4. Implement first 3 screens (already marked as ✅ READY)"
