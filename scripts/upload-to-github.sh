#!/bin/bash

# 🚀 OneMoment - Auto Upload to GitHub
# Uploads generated code to GitHub for Cursor to fetch

echo "📤 OneMoment GitHub Uploader"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Configuration
GITHUB_USER="whysophie"
GITHUB_REPO="OneMomentSuperApp"
GITHUB_BRANCH="main"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Get file to upload
FILE_PATH=$1
if [ -z "$FILE_PATH" ]; then
    echo -e "${YELLOW}Enter file path to upload:${NC}"
    read FILE_PATH
fi

# Check if file exists
if [ ! -f "$FILE_PATH" ]; then
    echo "File not found: $FILE_PATH"
    exit 1
fi

# Get commit message
echo -e "${YELLOW}Enter commit message:${NC}"
read -r COMMIT_MSG
if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="Auto-update $(basename $FILE_PATH)"
fi

# Stage and commit
git add "$FILE_PATH"
git commit -m "$COMMIT_MSG"

# Push to GitHub
echo -e "${YELLOW}⏫ Pushing to GitHub...${NC}"
git push origin $GITHUB_BRANCH

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Successfully pushed to GitHub${NC}"
    
    # Generate GitHub URL
    GITHUB_URL="https://github.com/$GITHUB_USER/$GITHUB_REPO/blob/$GITHUB_BRANCH/$FILE_PATH"
    echo -e "${GREEN}📎 GitHub URL:${NC}"
    echo "$GITHUB_URL"
    
    # Copy to clipboard if available
    if command -v pbcopy &> /dev/null; then
        echo "$GITHUB_URL" | pbcopy
        echo -e "${GREEN}✓ URL copied to clipboard${NC}"
    fi
    
    # Generate raw URL for direct download
    RAW_URL="https://raw.githubusercontent.com/$GITHUB_USER/$GITHUB_REPO/$GITHUB_BRANCH/$FILE_PATH"
    echo -e "${GREEN}📥 Direct download URL:${NC}"
    echo "$RAW_URL"
    
else
    echo -e "${RED}✗ Push failed${NC}"
    exit 1
fi