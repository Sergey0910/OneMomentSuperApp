#!/bin/bash

# 🚀 OneMoment - Auto Download Script for Cursor
# Downloads code from GitHub URL and places it in correct folder

echo "🚀 OneMoment Code Downloader"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get GitHub URL from argument or prompt
if [ -z "$1" ]; then
    echo -e "${YELLOW}Enter GitHub URL or file path:${NC}"
    read GITHUB_URL
else
    GITHUB_URL=$1
fi

# Parse the URL to determine file type and destination
if [[ $GITHUB_URL == *"github.com"* ]]; then
    # It's a GitHub URL
    echo -e "${GREEN}✓ GitHub URL detected${NC}"
    
    # Extract path from URL
    # Example: https://github.com/user/repo/blob/main/apps/guest-app/screens/Screen002.tsx
    FILE_PATH=$(echo $GITHUB_URL | sed 's/.*blob\/[^\/]*\///')
    RAW_URL=$(echo $GITHUB_URL | sed 's/github.com/raw.githubusercontent.com/' | sed 's/blob\///')
    
elif [[ $GITHUB_URL == *"gist.github.com"* ]]; then
    # It's a Gist
    echo -e "${GREEN}✓ GitHub Gist detected${NC}"
    RAW_URL="${GITHUB_URL}/raw"
    
    # Prompt for destination
    echo -e "${YELLOW}Enter destination path (e.g., apps/guest-app/screens/Screen002.tsx):${NC}"
    read FILE_PATH
else
    echo -e "${RED}✗ Invalid URL format${NC}"
    exit 1
fi

# Determine destination folder
DEST_DIR=$(dirname "$FILE_PATH")
DEST_FILE=$(basename "$FILE_PATH")

# Create directory if it doesn't exist
mkdir -p "$DEST_DIR"

# Download the file
echo -e "${YELLOW}⏬ Downloading from: $RAW_URL${NC}"
echo -e "${YELLOW}📁 Destination: $FILE_PATH${NC}"

curl -s -o "$FILE_PATH" "$RAW_URL"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Successfully downloaded: $DEST_FILE${NC}"
    echo -e "${GREEN}📍 Location: $FILE_PATH${NC}"
    
    # Detect file type and run appropriate commands
    if [[ $DEST_FILE == *.tsx ]] || [[ $DEST_FILE == *.ts ]]; then
        echo -e "${YELLOW}🔧 Running TypeScript check...${NC}"
        npx tsc --noEmit "$FILE_PATH" 2>/dev/null
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ TypeScript check passed${NC}"
        else
            echo -e "${YELLOW}⚠ TypeScript warnings detected${NC}"
        fi
        
        echo -e "${YELLOW}🎨 Running Prettier...${NC}"
        npx prettier --write "$FILE_PATH"
        
        echo -e "${YELLOW}📝 Running ESLint...${NC}"
        npx eslint --fix "$FILE_PATH"
    fi
    
    # Update screen tracking
    if [[ $FILE_PATH == *"Screen"* ]]; then
        SCREEN_NUM=$(echo $DEST_FILE | grep -o '[0-9]\+' | head -1)
        echo -e "${GREEN}✓ Screen $SCREEN_NUM downloaded${NC}"
        
        # Update progress file
        echo "Screen $SCREEN_NUM: Downloaded $(date)" >> .progress.log
    fi
    
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ Ready to edit in Cursor!${NC}"
    
    # Open in Cursor if available
    if command -v cursor &> /dev/null; then
        echo -e "${YELLOW}Opening in Cursor...${NC}"
        cursor "$FILE_PATH"
    fi
    
else
    echo -e "${RED}✗ Download failed${NC}"
    exit 1
fi