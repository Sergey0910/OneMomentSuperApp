#!/bin/bash

echo "🚀 Checking Docker status..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed!"
    echo ""
    echo "📥 Please install Docker Desktop:"
    echo "1. Download from: https://www.docker.com/products/docker-desktop/"
    echo "2. Install and launch Docker Desktop"
    echo "3. Wait for Docker to start (icon in menu bar)"
    echo "4. Run this script again"
    exit 1
fi

# Check if Docker daemon is running
if ! docker info &> /dev/null; then
    echo "⚠️ Docker is installed but not running!"
    echo ""
    echo "🔧 To fix:"
    echo "1. Open Docker Desktop app"
    echo "2. Wait for it to start (green icon)"
    echo "3. Run ./start-backend.sh again"
    
    # Try to open Docker Desktop on macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo ""
        echo "🚀 Attempting to start Docker Desktop..."
        open -a Docker
        echo "⏳ Please wait for Docker to start (30-60 seconds)"
        echo "Then run: ./start-backend.sh"
    fi
    exit 1
fi

echo "✅ Docker is running!"
echo ""
echo "Now you can run:"
echo "./start-backend.sh"
