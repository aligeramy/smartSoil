const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Ensure the directories exist
const outputDir = path.join(__dirname, '../assets/app-icons/ios');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Source icons
const sourceIconGreen = path.join(__dirname, '../assets/images/logo/icon/icon.png');
const sourceIconWhite = path.join(__dirname, '../assets/images/logo/icon/icon-w.png');
const sourceIconBlack = path.join(__dirname, '../assets/images/logo/icon/icon-b.png');

// Define iOS icon specifications
const iOSIcons = [
  { name: 'icon-20.png', size: 20 },
  { name: 'icon-20@2x.png', size: 40 },
  { name: 'icon-20@3x.png', size: 60 },
  { name: 'icon-29.png', size: 29 },
  { name: 'icon-29@2x.png', size: 58 },
  { name: 'icon-29@3x.png', size: 87 },
  { name: 'icon-40.png', size: 40 },
  { name: 'icon-40@2x.png', size: 80 },
  { name: 'icon-40@3x.png', size: 120 },
  { name: 'icon-60.png', size: 60 },
  { name: 'icon-60@2x.png', size: 120 },
  { name: 'icon-60@3x.png', size: 180 },
  { name: 'icon-76.png', size: 76 },
  { name: 'icon-76@2x.png', size: 152 },
  { name: 'icon-83.5@2x.png', size: 167 },
  { name: 'app-store-icon.png', size: 1024 }
];

// Create a base icon with green background and white logo
async function createBaseIcon(size) {
  // Resize the white logo for compositing
  const resizedWhiteLogo = await sharp(sourceIconWhite)
    .resize(Math.round(size * 0.8), Math.round(size * 0.8), { 
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toBuffer();

  // Create a green background with the white logo
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 6, g: 59, b: 29, alpha: 1 } // Dark green background
    }
  })
  .composite([{ 
    input: resizedWhiteLogo,
    gravity: 'center'
  }])
  .png()
  .toBuffer();
}

async function generateIOSIcons() {
  try {
    console.log('Generating iOS icons...');
    
    // Generate each icon
    for (const icon of iOSIcons) {
      const iconBuffer = await createBaseIcon(icon.size);
      await fs.promises.writeFile(path.join(outputDir, icon.name), iconBuffer);
      console.log(`Generated ${icon.name} (${icon.size}x${icon.size})`);
    }

    // Also save the app store icon for reference in our main icon folder
    const appStoreIconBuffer = await createBaseIcon(1024);
    const mainIconsDir = path.join(__dirname, '../assets/images/logo/icon');
    await fs.promises.writeFile(path.join(mainIconsDir, 'ios-tinted.png'), appStoreIconBuffer);
    
    console.log('\nAll iOS icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIOSIcons(); 