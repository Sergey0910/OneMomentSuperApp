#!/bin/bash

# MCP Server Configuration Helper
# This script helps configure MCP servers for Claude Desktop

echo "🔧 MCP Server Configuration"
echo "=========================="
echo ""

# Check Claude Desktop config
CONFIG_PATH="$HOME/Library/Application Support/Claude/claude_desktop_config.json"

if [ -f "$CONFIG_PATH" ]; then
    echo "✅ Claude config found at:"
    echo "   $CONFIG_PATH"
    echo ""
    echo "📝 Current MCP configuration:"
    cat "$CONFIG_PATH" | python3 -m json.tool
else
    echo "⚠️ Claude config not found!"
    echo ""
    echo "Creating default config..."
    
    mkdir -p "$HOME/Library/Application Support/Claude"
    
    cat > "$CONFIG_PATH" << 'EOF'
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-filesystem",
        "/Users/whysophie/Desktop"
      ]
    },
    "github": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token-here"
      }
    }
  }
}
EOF
    
    echo "✅ Default config created!"
fi

echo ""
echo "📌 To fix MCP server issues:"
echo "1. Edit the config file above"
echo "2. Remove servers you don't need"
echo "3. Restart Claude Desktop"
echo ""
echo "🚀 Essential servers for OneMomentSuperApp:"
echo "   - filesystem (file access)"
echo "   - github (version control)"
echo "   - memory (context storage)"
echo ""
echo "Optional servers can be disabled to reduce warnings."
