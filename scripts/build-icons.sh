#!/bin/bash
# Script to prepare all app icons for iOS and Android

# Colors for console output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print banner
echo -e "${BLUE}===========================================${NC}"
echo -e "${BLUE}  SmartSoil Icon Generator               ${NC}"
echo -e "${BLUE}===========================================${NC}"

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo -e "${RED}Error: ImageMagick is not installed${NC}"
    echo "Please install ImageMagick to continue:"
    echo "  macOS: brew install imagemagick"
    echo "  Linux: sudo apt-get install imagemagick"
    echo "  Windows: https://imagemagick.org/script/download.php"
    exit 1
fi

echo -e "${GREEN}✓ ImageMagick detected${NC}"

# Define paths
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SOURCE_ICON="$PROJECT_ROOT/assets/images/logo/icon/icon.png"
ADAPTIVE_ICON="$PROJECT_ROOT/assets/images/logo/icon/adaptive-icon.png"
OUTPUT_DIR="$PROJECT_ROOT/assets/app-icons"
IOS_DIR="$OUTPUT_DIR/ios"
ANDROID_DIR="$OUTPUT_DIR/android"
BG_COLOR="#063B1D"

# Check if source files exist
if [ ! -f "$SOURCE_ICON" ]; then
    echo -e "${RED}Error: Source icon not found at $SOURCE_ICON${NC}"
    exit 1
fi

if [ ! -f "$ADAPTIVE_ICON" ]; then
    echo -e "${RED}Error: Adaptive icon not found at $ADAPTIVE_ICON${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Source icons found${NC}"

# Create output directories
mkdir -p "$IOS_DIR"
mkdir -p "$ANDROID_DIR"

echo -e "${GREEN}✓ Output directories created${NC}"

# Generate iOS icons
echo -e "\n${BLUE}Generating iOS icons...${NC}"

# App Store
convert "$SOURCE_ICON" -resize 1024x1024 "$IOS_DIR/app-store-icon.png"
echo -e "${GREEN}✓ Generated App Store icon (1024x1024)${NC}"

# iPhone Icons
convert "$SOURCE_ICON" -resize 60x60 "$IOS_DIR/icon-60.png"
convert "$SOURCE_ICON" -resize 120x120 "$IOS_DIR/icon-60@2x.png"
convert "$SOURCE_ICON" -resize 180x180 "$IOS_DIR/icon-60@3x.png"
echo -e "${GREEN}✓ Generated iPhone icons${NC}"

# iPad Icons
convert "$SOURCE_ICON" -resize 76x76 "$IOS_DIR/icon-76.png"
convert "$SOURCE_ICON" -resize 152x152 "$IOS_DIR/icon-76@2x.png"
convert "$SOURCE_ICON" -resize 167x167 "$IOS_DIR/icon-83.5@2x.png"
echo -e "${GREEN}✓ Generated iPad icons${NC}"

# Spotlight Icons
convert "$SOURCE_ICON" -resize 40x40 "$IOS_DIR/icon-40.png"
convert "$SOURCE_ICON" -resize 80x80 "$IOS_DIR/icon-40@2x.png"
convert "$SOURCE_ICON" -resize 120x120 "$IOS_DIR/icon-40@3x.png"
echo -e "${GREEN}✓ Generated Spotlight icons${NC}"

# Settings Icons
convert "$SOURCE_ICON" -resize 29x29 "$IOS_DIR/icon-29.png"
convert "$SOURCE_ICON" -resize 58x58 "$IOS_DIR/icon-29@2x.png"
convert "$SOURCE_ICON" -resize 87x87 "$IOS_DIR/icon-29@3x.png"
echo -e "${GREEN}✓ Generated Settings icons${NC}"

# Notification Icons
convert "$SOURCE_ICON" -resize 20x20 "$IOS_DIR/icon-20.png"
convert "$SOURCE_ICON" -resize 40x40 "$IOS_DIR/icon-20@2x.png"
convert "$SOURCE_ICON" -resize 60x60 "$IOS_DIR/icon-20@3x.png"
echo -e "${GREEN}✓ Generated Notification icons${NC}"

# Generate Android icons
echo -e "\n${BLUE}Generating Android icons...${NC}"

# Create Android mipmap directories
mkdir -p "$ANDROID_DIR/mipmap-mdpi"
mkdir -p "$ANDROID_DIR/mipmap-hdpi"
mkdir -p "$ANDROID_DIR/mipmap-xhdpi"
mkdir -p "$ANDROID_DIR/mipmap-xxhdpi"
mkdir -p "$ANDROID_DIR/mipmap-xxxhdpi"

# Regular Icons
convert "$SOURCE_ICON" -resize 48x48 "$ANDROID_DIR/mipmap-mdpi/ic_launcher.png"
convert "$SOURCE_ICON" -resize 72x72 "$ANDROID_DIR/mipmap-hdpi/ic_launcher.png"
convert "$SOURCE_ICON" -resize 96x96 "$ANDROID_DIR/mipmap-xhdpi/ic_launcher.png"
convert "$SOURCE_ICON" -resize 144x144 "$ANDROID_DIR/mipmap-xxhdpi/ic_launcher.png"
convert "$SOURCE_ICON" -resize 192x192 "$ANDROID_DIR/mipmap-xxxhdpi/ic_launcher.png"
echo -e "${GREEN}✓ Generated regular Android icons${NC}"

# Adaptive Icons - Foreground
convert "$ADAPTIVE_ICON" -resize 108x108 "$ANDROID_DIR/mipmap-mdpi/ic_launcher_foreground.png"
convert "$ADAPTIVE_ICON" -resize 162x162 "$ANDROID_DIR/mipmap-hdpi/ic_launcher_foreground.png"
convert "$ADAPTIVE_ICON" -resize 216x216 "$ANDROID_DIR/mipmap-xhdpi/ic_launcher_foreground.png"
convert "$ADAPTIVE_ICON" -resize 324x324 "$ANDROID_DIR/mipmap-xxhdpi/ic_launcher_foreground.png"
convert "$ADAPTIVE_ICON" -resize 432x432 "$ANDROID_DIR/mipmap-xxxhdpi/ic_launcher_foreground.png"
echo -e "${GREEN}✓ Generated adaptive foreground icons${NC}"

# Adaptive Icons - Background (solid color)
convert -size 108x108 xc:$BG_COLOR "$ANDROID_DIR/mipmap-mdpi/ic_launcher_background.png"
convert -size 162x162 xc:$BG_COLOR "$ANDROID_DIR/mipmap-hdpi/ic_launcher_background.png"
convert -size 216x216 xc:$BG_COLOR "$ANDROID_DIR/mipmap-xhdpi/ic_launcher_background.png"
convert -size 324x324 xc:$BG_COLOR "$ANDROID_DIR/mipmap-xxhdpi/ic_launcher_background.png"
convert -size 432x432 xc:$BG_COLOR "$ANDROID_DIR/mipmap-xxxhdpi/ic_launcher_background.png"
echo -e "${GREEN}✓ Generated adaptive background icons${NC}"

# Play Store Icon
convert "$SOURCE_ICON" -resize 512x512 "$ANDROID_DIR/play-store-icon.png"
echo -e "${GREEN}✓ Generated Play Store icon${NC}"

# Summary
echo -e "\n${BLUE}===========================================${NC}"
echo -e "${GREEN}Icon generation complete!${NC}"
echo -e "iOS icons saved to: ${IOS_DIR}"
echo -e "Android icons saved to: ${ANDROID_DIR}"
echo -e "${BLUE}===========================================${NC}"

echo -e "\n${BLUE}Next steps:${NC}"
echo -e "1. For iOS: Update your app.json file with the correct icon paths"
echo -e "2. For Android: Make sure the adaptive icon settings are correct"
echo -e "3. Run your build command: npm run build:android-aab or eas build"
echo -e "\n${GREEN}Done!${NC}" 