#!/usr/bin/env node

/**
 * Android build script for SmartSoil app
 * This script helps with building the Android app in different configurations
 * Run with: node scripts/android-build.js [dev|preview|apk|aab]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get the build type from the command line arguments
const buildType = process.argv[2] || 'dev';

// Map of build type to EAS build profile
const buildProfiles = {
  dev: 'development',
  preview: 'preview',
  apk: 'androidApk',
  aab: 'production'
};

// Check if the build type is valid
if (!buildProfiles[buildType]) {
  console.error(`Invalid build type: ${buildType}`);
  console.error('Valid build types: dev, preview, apk, aab');
  process.exit(1);
}

// Get the selected build profile
const profile = buildProfiles[buildType];

// Print a message
console.log(`Building Android app with profile: ${profile}`);
console.log('This may take a few minutes...');

try {
  // Check for eas-cli
  try {
    execSync('eas --version', { stdio: 'ignore' });
  } catch (e) {
    console.log('Installing EAS CLI...');
    execSync('npm install -g eas-cli', { stdio: 'inherit' });
  }

  // Run the build command
  execSync(`eas build --platform android --profile ${profile}${buildType === 'dev' ? ' --local' : ''}`, {
    stdio: 'inherit'
  });

  if (buildType === 'dev') {
    // For dev builds, we might want to install on a connected device
    console.log('\nDo you want to install the app on a connected device? (y/n)');
    process.stdin.once('data', (data) => {
      const answer = data.toString().trim().toLowerCase();
      if (answer === 'y' || answer === 'yes') {
        try {
          console.log('Installing on connected device...');
          // Find the APK file in the build directory
          const buildDir = path.resolve(__dirname, '../build');
          const apkFiles = fs.readdirSync(buildDir).filter(file => file.endsWith('.apk'));
          
          if (apkFiles.length === 0) {
            console.error('No APK files found in the build directory');
            process.exit(1);
          }
          
          // Sort by modified date (newest first)
          const sortedApks = apkFiles.map(file => ({
            name: file,
            time: fs.statSync(path.join(buildDir, file)).mtime.getTime()
          })).sort((a, b) => b.time - a.time);
          
          const latestApk = sortedApks[0].name;
          const apkPath = path.join(buildDir, latestApk);
          
          // Install the APK
          execSync(`adb install -r "${apkPath}"`, { stdio: 'inherit' });
          console.log('App installed successfully!');
        } catch (e) {
          console.error('Error installing app:', e.message);
        }
      } else {
        console.log('Skipping installation');
      }
      process.exit(0);
    });
  } else {
    console.log('\nBuild completed successfully!');
    console.log('Your build is available in the EAS dashboard.');
  }
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
} 