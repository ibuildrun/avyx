import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, '../../assets');

const logoSvg = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="coralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FF7F50"/>
      <stop offset="100%" style="stop-color:#FF6B6B"/>
    </linearGradient>
  </defs>
  <circle cx="256" cy="256" r="256" fill="url(#coralGradient)"/>
  <path d="M256 100L356 256L256 412L156 256L256 100Z" fill="white" fill-opacity="0.95"/>
  <path d="M256 160L316 256L256 352L196 256L256 160Z" fill="url(#coralGradient)"/>
</svg>`;

const logoRoundedSvg = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="coralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FF7F50"/>
      <stop offset="100%" style="stop-color:#FF6B6B"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="128" fill="url(#coralGradient)"/>
  <path d="M256 100L356 256L256 412L156 256L256 100Z" fill="white" fill-opacity="0.95"/>
  <path d="M256 160L316 256L256 352L196 256L256 160Z" fill="url(#coralGradient)"/>
</svg>`;

async function generateLogos() {
  console.log('Generating PNG logos...\n');

  // Circle logo for bot avatar (512x512)
  await sharp(Buffer.from(logoSvg))
    .resize(512, 512)
    .png()
    .toFile(join(assetsDir, 'logo-512.png'));
  console.log('Created: assets/logo-512.png (for bot avatar)');

  // Rounded logo (512x512)
  await sharp(Buffer.from(logoRoundedSvg))
    .resize(512, 512)
    .png()
    .toFile(join(assetsDir, 'logo-rounded-512.png'));
  console.log('Created: assets/logo-rounded-512.png');

  // Favicon sizes
  await sharp(Buffer.from(logoRoundedSvg))
    .resize(32, 32)
    .png()
    .toFile(join(assetsDir, 'favicon-32.png'));
  console.log('Created: assets/favicon-32.png');

  await sharp(Buffer.from(logoRoundedSvg))
    .resize(192, 192)
    .png()
    .toFile(join(assetsDir, 'favicon-192.png'));
  console.log('Created: assets/favicon-192.png');

  // ICO format for favicon
  await sharp(Buffer.from(logoRoundedSvg))
    .resize(32, 32)
    .png()
    .toFile(join(assetsDir, 'favicon.ico'));
  console.log('Created: assets/favicon.ico');

  console.log('\nDone! Use logo-512.png for Telegram bot avatar.');
}

generateLogos().catch(console.error);
