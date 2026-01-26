/**
 * Icon Generation Script for Ni-RE
 *
 * This script generates all required app icons for Android and iOS from the SVG source.
 *
 * Prerequisites:
 *   npm install sharp --save-dev
 *
 * Usage:
 *   node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('Error: sharp is not installed.');
  console.error('Please run: npm install sharp --save-dev');
  console.error('Then run this script again.');
  process.exit(1);
}

const SVG_SOURCE = path.join(__dirname, '..', 'assets', 'icon-source.svg');
const ANDROID_RES = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');
const IOS_ASSETS = path.join(__dirname, '..', 'ios', 'TempProject', 'Images.xcassets', 'AppIcon.appiconset');

// Android icon sizes (density -> size in pixels)
const ANDROID_SIZES = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

// iOS icon sizes (filename -> size in pixels)
const IOS_SIZES = {
  'Icon-20@2x.png': 40,
  'Icon-20@3x.png': 60,
  'Icon-29@2x.png': 58,
  'Icon-29@3x.png': 87,
  'Icon-40@2x.png': 80,
  'Icon-40@3x.png': 120,
  'Icon-60@2x.png': 120,
  'Icon-60@3x.png': 180,
  'Icon-1024.png': 1024,
};

async function generateAndroidIcons() {
  console.log('Generating Android icons...');

  for (const [folder, size] of Object.entries(ANDROID_SIZES)) {
    const outputDir = path.join(ANDROID_RES, folder);

    // Ensure directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate square icon
    const squareOutput = path.join(outputDir, 'ic_launcher.png');
    await sharp(SVG_SOURCE)
      .resize(size, size)
      .png()
      .toFile(squareOutput);
    console.log(`  Created: ${squareOutput}`);

    // Generate round icon (same image, Android handles masking)
    const roundOutput = path.join(outputDir, 'ic_launcher_round.png');
    await sharp(SVG_SOURCE)
      .resize(size, size)
      .png()
      .toFile(roundOutput);
    console.log(`  Created: ${roundOutput}`);
  }
}

async function generateIosIcons() {
  console.log('Generating iOS icons...');

  // Ensure directory exists
  if (!fs.existsSync(IOS_ASSETS)) {
    fs.mkdirSync(IOS_ASSETS, { recursive: true });
  }

  for (const [filename, size] of Object.entries(IOS_SIZES)) {
    const output = path.join(IOS_ASSETS, filename);
    await sharp(SVG_SOURCE)
      .resize(size, size)
      .png()
      .toFile(output);
    console.log(`  Created: ${output}`);
  }

  // Update Contents.json with filenames
  const contentsJson = {
    images: [
      { idiom: 'iphone', scale: '2x', size: '20x20', filename: 'Icon-20@2x.png' },
      { idiom: 'iphone', scale: '3x', size: '20x20', filename: 'Icon-20@3x.png' },
      { idiom: 'iphone', scale: '2x', size: '29x29', filename: 'Icon-29@2x.png' },
      { idiom: 'iphone', scale: '3x', size: '29x29', filename: 'Icon-29@3x.png' },
      { idiom: 'iphone', scale: '2x', size: '40x40', filename: 'Icon-40@2x.png' },
      { idiom: 'iphone', scale: '3x', size: '40x40', filename: 'Icon-40@3x.png' },
      { idiom: 'iphone', scale: '2x', size: '60x60', filename: 'Icon-60@2x.png' },
      { idiom: 'iphone', scale: '3x', size: '60x60', filename: 'Icon-60@3x.png' },
      { idiom: 'ios-marketing', scale: '1x', size: '1024x1024', filename: 'Icon-1024.png' },
    ],
    info: { author: 'xcode', version: 1 },
  };

  const contentsPath = path.join(IOS_ASSETS, 'Contents.json');
  fs.writeFileSync(contentsPath, JSON.stringify(contentsJson, null, 2));
  console.log(`  Updated: ${contentsPath}`);
}

async function main() {
  console.log('Ni-RE Icon Generator');
  console.log('====================\n');

  if (!fs.existsSync(SVG_SOURCE)) {
    console.error(`Error: SVG source not found at ${SVG_SOURCE}`);
    process.exit(1);
  }

  try {
    await generateAndroidIcons();
    console.log('');
    await generateIosIcons();
    console.log('\nIcon generation complete!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

main();
