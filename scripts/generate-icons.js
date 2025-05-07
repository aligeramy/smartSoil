// This script generates app icons for iOS and Android from a source image
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Make sure the script works even if ImageMagick isn't installed
try {
  execSync('convert -version', { stdio: 'ignore' });
  console.log('✅ ImageMagick detected');
} catch (err) {
  console.error('❌ ImageMagick not found. Please install it to use this script:');
  console.error('   macOS: brew install imagemagick');
  console.error('   Linux: sudo apt-get install imagemagick');
  console.error('   Windows: https://imagemagick.org/script/download.php');
  process.exit(1);
}

// Configuration
const sourceIcon = path.resolve(__dirname, '../assets/images/logo/icon/icon.png');
const adaptiveIcon = path.resolve(__dirname, '../assets/images/logo/icon/adaptive-icon.png');
const outputDir = path.resolve(__dirname, '../assets/app-icons');
const backgroundColor = '#063B1D'; // Green background

// iOS icon sizes needed (square with rounded corners applied by iOS)
const iosIconSizes = [
  { name: 'icon-20.png', size: 20 },
  { name: 'icon-20@2x.png', size: 40 },
  { name: 'icon-20@3x.png', size: 60 },
  { name: 'icon-29.png', size: 29 },
  { name: 'icon-29@2x.png', size: 58 },
  { name: 'icon-29@3x.png', size: 87 },
  { name: 'icon-40.png', size: 40 },
  { name: 'icon-40@2x.png', size: 80 },
  { name: 'icon-40@3x.png', size: 120 },
  { name: 'icon-60@2x.png', size: 120 },
  { name: 'icon-60@3x.png', size: 180 },
  { name: 'icon-76.png', size: 76 },
  { name: 'icon-76@2x.png', size: 152 },
  { name: 'icon-83.5@2x.png', size: 167 },
  { name: 'icon-1024.png', size: 1024 } // App Store icon
];

// Android icon sizes needed
const androidIconSizes = [
  { dir: 'mipmap-mdpi', size: 48 },
  { dir: 'mipmap-hdpi', size: 72 },
  { dir: 'mipmap-xhdpi', size: 96 },
  { dir: 'mipmap-xxhdpi', size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 }
];

// Create output directories
const iosOutputDir = path.join(outputDir, 'ios');
const androidOutputDir = path.join(outputDir, 'android');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}
if (!fs.existsSync(iosOutputDir)) {
  fs.mkdirSync(iosOutputDir);
}
if (!fs.existsSync(androidOutputDir)) {
  fs.mkdirSync(androidOutputDir);
}

// Generate iOS icons
console.log('🍎 Generating iOS icons...');
iosIconSizes.forEach(({ name, size }) => {
  const output = path.join(iosOutputDir, name);
  const command = `convert "${sourceIcon}" -resize ${size}x${size} "${output}"`;
  
  try {
    execSync(command);
    console.log(`✅ Generated ${name} (${size}x${size}px)`);
  } catch (error) {
    console.error(`❌ Error generating ${name}: ${error.message}`);
  }
});

// Generate Android icons
console.log('\n🤖 Generating Android icons...');
androidIconSizes.forEach(({ dir, size }) => {
  const dirPath = path.join(androidOutputDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  // Regular icon
  const iconOutput = path.join(dirPath, 'ic_launcher.png');
  const iconCommand = `convert "${sourceIcon}" -resize ${size}x${size} "${iconOutput}"`;
  
  // Adaptive foreground icon
  const foregroundOutput = path.join(dirPath, 'ic_launcher_foreground.png');
  const foregroundCommand = `convert "${adaptiveIcon}" -resize ${size}x${size} "${foregroundOutput}"`;
  
  // Adaptive background icon (solid color)
  const backgroundOutput = path.join(dirPath, 'ic_launcher_background.png');
  const backgroundCommand = `convert -size ${size}x${size} xc:${backgroundColor} "${backgroundOutput}"`;
  
  try {
    execSync(iconCommand);
    console.log(`✅ Generated regular icon for ${dir} (${size}x${size}px)`);
    
    execSync(foregroundCommand);
    console.log(`✅ Generated adaptive foreground for ${dir} (${size}x${size}px)`);
    
    execSync(backgroundCommand);
    console.log(`✅ Generated adaptive background for ${dir} (${size}x${size}px)`);
  } catch (error) {
    console.error(`❌ Error generating ${dir} icons: ${error.message}`);
  }
});

// Generate high-resolution icons for Play Store
const playStoreOutput = path.join(androidOutputDir, 'play_store_512.png');
const playStoreCommand = `convert "${sourceIcon}" -resize 512x512 "${playStoreOutput}"`;

try {
  execSync(playStoreCommand);
  console.log(`✅ Generated Play Store icon (512x512px)`);
} catch (error) {
  console.error(`❌ Error generating Play Store icon: ${error.message}`);
}

console.log('\n🎉 Icon generation complete!');
console.log(`iOS icons saved to: ${iosOutputDir}`);
console.log(`Android icons saved to: ${androidOutputDir}`);
console.log('\nManual steps:');
console.log('1. For iOS: Copy the icons to your Xcode project\'s AppIcon asset catalog');
console.log('2. For Android: Copy the appropriate mipmap folders to your Android project\'s res directory');
console.log('3. Or use EAS Build which will handle this automatically with the app.json configuration'); 