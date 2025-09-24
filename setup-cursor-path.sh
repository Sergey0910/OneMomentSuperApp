#!/bin/bash

# 🚀 Cursor PATH Setup Script

echo "🔧 Setting up Cursor command..."

# Check if Cursor.app exists
if [ -d "/Applications/Cursor.app" ]; then
    echo "✅ Cursor.app found"
    
    # Add to .zshrc
    echo "" >> ~/.zshrc
    echo "# Cursor command" >> ~/.zshrc
    echo 'export PATH="/Applications/Cursor.app/Contents/MacOS:$PATH"' >> ~/.zshrc
    echo "✅ Added to .zshrc"
    
    # Create alias
    echo 'alias cursor="/Applications/Cursor.app/Contents/MacOS/Cursor"' >> ~/.zshrc
    echo "✅ Alias created"
    
    echo ""
    echo "📌 Now run:"
    echo "source ~/.zshrc"
    echo ""
    echo "Then you can use: cursor ."
    
else
    echo "❌ Cursor.app not found in /Applications/"
    echo "Please make sure Cursor is installed"
fi