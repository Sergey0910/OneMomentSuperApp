#!/bin/bash

echo "🚀 Setting up GitHub repository for OneMomentSuperApp"
echo "=================================================="
echo ""

# Check current directory
echo "📍 Current location: $(pwd)"
cd /Users/whysophie/Desktop/OneMomentSuperApp

# Initialize git if not already
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    
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

# Misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.idea/
.vscode/
*.swp
*.swo

# PocketBase
pb_data/
pb_public/

# OS
Thumbs.db
EOF

    echo "✅ Created .gitignore"
    
    # Add all files
    git add .
    git commit -m "🚀 Initial commit: OneMomentSuperApp MVP
    
- 10/13 screens completed for MVP
- React Native + Module Federation architecture  
- PocketBase backend configured
- Payment Flow ready for implementation
- 81 screens documented and planned"
fi

echo ""
echo "📝 GitHub Repository Setup Instructions:"
echo "========================================"
echo ""
echo "1️⃣ Go to: https://github.com/new"
echo ""
echo "2️⃣ Fill in:"
echo "   Repository name: OneMomentSuperApp"
echo "   Description: 81-screen travel super app with Module Federation"
echo "   ✅ Public (required for Codex)"
echo "   ❌ DON'T add README (we have one)"
echo "   ❌ DON'T add .gitignore (we have one)"
echo ""
echo "3️⃣ Click 'Create repository'"
echo ""
echo "4️⃣ Copy and run these commands:"
echo "----------------------------------------"
echo "git remote add origin https://github.com/YOUR_USERNAME/OneMomentSuperApp.git"
echo "git branch -M main"
echo "git push -u origin main"
echo "----------------------------------------"
echo ""
echo "✅ After pushing, return here to configure Codex!"
