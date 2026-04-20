#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BUILD_DIR = join(__dirname, '../build');
const INPUT_PNG = join(BUILD_DIR, 'icon.png');
const OUTPUT_ICO = join(BUILD_DIR, 'icon.ico');

async function main() {
  console.log('🎨 Generating Windows .ico icon...\n');

  try {
    // Resize to square first
    console.log('   • Resizing to 512x512 square...');
    const squareBuffer = await sharp(INPUT_PNG)
      .resize(512, 512, { fit: 'cover' })
      .png()
      .toBuffer();

    console.log('   • Converting to .ico format...');
    const icoBuffer = await pngToIco(squareBuffer);

    writeFileSync(OUTPUT_ICO, icoBuffer);

    console.log(`✅ Success! Created ${OUTPUT_ICO}`);
  } catch (error) {
    console.error('❌ Error generating .ico file:', error.message);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
