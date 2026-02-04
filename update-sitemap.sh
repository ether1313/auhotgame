#!/bin/bash

# Auto-update sitemap.xml lastmod date
# Usage: ./update-sitemap.sh

SITEMAP_FILE="sitemap.xml"

# Get current date in ISO 8601 format with timezone
LASTMOD=$(date -u +"%Y-%m-%dT%H:%M:%S+00:00")

# Check if sitemap.xml exists
if [ ! -f "$SITEMAP_FILE" ]; then
    echo "❌ Error: $SITEMAP_FILE not found!"
    exit 1
fi

# Update lastmod date using sed (works on macOS and Linux)
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|<lastmod>.*</lastmod>|<lastmod>$LASTMOD</lastmod>|g" "$SITEMAP_FILE"
else
    # Linux
    sed -i "s|<lastmod>.*</lastmod>|<lastmod>$LASTMOD</lastmod>|g" "$SITEMAP_FILE"
fi

echo "✅ Sitemap updated successfully!"
echo "   Lastmod set to: $LASTMOD"
