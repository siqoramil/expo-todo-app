const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ASSETS_DIR = path.join(__dirname, '..', 'assets', 'images');

// Todo App brand color - modern blue-violet gradient feel
const PRIMARY_COLOR = '#6C63FF';
const PRIMARY_DARK = '#5A52E0';
const BG_COLOR = '#FFFFFF';
const CHECK_COLOR = '#FFFFFF';

function createIconSVG(size) {
  const padding = Math.round(size * 0.15);
  const iconArea = size - padding * 2;
  const centerX = size / 2;
  const centerY = size / 2;

  // Rounded square background radius
  const bgRoundRadius = Math.round(size * 0.22);
  const bgMargin = Math.round(size * 0.04);

  // Checkmark and list lines sizing
  const checkboxSize = Math.round(iconArea * 0.22);
  const checkboxX = centerX - Math.round(iconArea * 0.28);
  const lineStartX = centerX - Math.round(iconArea * 0.08);
  const lineEndX = centerX + Math.round(iconArea * 0.32);
  const lineHeight = Math.round(iconArea * 0.04);
  const rowSpacing = Math.round(iconArea * 0.22);

  // 3 rows position
  const row1Y = centerY - rowSpacing;
  const row2Y = centerY;
  const row3Y = centerY + rowSpacing;

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${PRIMARY_COLOR};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${PRIMARY_DARK};stop-opacity:1" />
    </linearGradient>
    <linearGradient id="shineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:0.15" />
      <stop offset="50%" style="stop-color:#FFFFFF;stop-opacity:0" />
    </linearGradient>
  </defs>

  <!-- Background rounded rect -->
  <rect x="${bgMargin}" y="${bgMargin}" width="${size - bgMargin * 2}" height="${size - bgMargin * 2}" rx="${bgRoundRadius}" ry="${bgRoundRadius}" fill="url(#bgGrad)"/>

  <!-- Subtle shine overlay -->
  <rect x="${bgMargin}" y="${bgMargin}" width="${size - bgMargin * 2}" height="${size - bgMargin * 2}" rx="${bgRoundRadius}" ry="${bgRoundRadius}" fill="url(#shineGrad)"/>

  <!-- Row 1: Checked checkbox + line -->
  ${createCheckedCheckbox(checkboxX, row1Y - checkboxSize / 2, checkboxSize)}
  <rect x="${lineStartX}" y="${row1Y - lineHeight / 2}" width="${lineEndX - lineStartX}" height="${lineHeight}" rx="${lineHeight / 2}" fill="${CHECK_COLOR}" opacity="0.9"/>

  <!-- Row 2: Checked checkbox + line -->
  ${createCheckedCheckbox(checkboxX, row2Y - checkboxSize / 2, checkboxSize)}
  <rect x="${lineStartX}" y="${row2Y - lineHeight / 2}" width="${(lineEndX - lineStartX) * 0.7}" height="${lineHeight}" rx="${lineHeight / 2}" fill="${CHECK_COLOR}" opacity="0.9"/>

  <!-- Row 3: Empty checkbox + line -->
  ${createEmptyCheckbox(checkboxX, row3Y - checkboxSize / 2, checkboxSize)}
  <rect x="${lineStartX}" y="${row3Y - lineHeight / 2}" width="${(lineEndX - lineStartX) * 0.85}" height="${lineHeight}" rx="${lineHeight / 2}" fill="${CHECK_COLOR}" opacity="0.5"/>

</svg>`;
}

function createCheckedCheckbox(x, y, size) {
  const r = Math.round(size * 0.2);
  const strokeW = Math.max(2, Math.round(size * 0.08));
  // Checkmark path points
  const cx = x + size / 2;
  const cy = y + size / 2;
  const s = size * 0.3;
  return `
  <rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${r}" ry="${r}" fill="${CHECK_COLOR}" opacity="0.95"/>
  <polyline points="${cx - s * 0.8},${cy} ${cx - s * 0.15},${cy + s * 0.7} ${cx + s * 0.9},${cy - s * 0.6}"
    fill="none" stroke="${PRIMARY_COLOR}" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function createEmptyCheckbox(x, y, size) {
  const r = Math.round(size * 0.2);
  const strokeW = Math.max(2, Math.round(size * 0.08));
  return `
  <rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${r}" ry="${r}" fill="none" stroke="${CHECK_COLOR}" stroke-width="${strokeW}" opacity="0.7"/>`;
}

function createAdaptiveIconSVG(size) {
  // Adaptive icon foreground: just the todo list icon centered, no background
  // The foreground should use ~66% of the canvas (safe zone)
  const safeZone = size * 0.66;
  const offset = (size - safeZone) / 2;

  const centerX = size / 2;
  const centerY = size / 2;
  const iconArea = safeZone * 0.8;

  const checkboxSize = Math.round(iconArea * 0.22);
  const checkboxX = centerX - Math.round(iconArea * 0.28);
  const lineStartX = centerX - Math.round(iconArea * 0.08);
  const lineEndX = centerX + Math.round(iconArea * 0.32);
  const lineHeight = Math.round(iconArea * 0.045);
  const rowSpacing = Math.round(iconArea * 0.24);

  const row1Y = centerY - rowSpacing;
  const row2Y = centerY;
  const row3Y = centerY + rowSpacing;

  const ICON_COLOR = PRIMARY_COLOR;

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Row 1: Checked -->
  ${createCheckedCheckboxDark(checkboxX, row1Y - checkboxSize / 2, checkboxSize, ICON_COLOR)}
  <rect x="${lineStartX}" y="${row1Y - lineHeight / 2}" width="${lineEndX - lineStartX}" height="${lineHeight}" rx="${lineHeight / 2}" fill="${ICON_COLOR}" opacity="0.8"/>

  <!-- Row 2: Checked -->
  ${createCheckedCheckboxDark(checkboxX, row2Y - checkboxSize / 2, checkboxSize, ICON_COLOR)}
  <rect x="${lineStartX}" y="${row2Y - lineHeight / 2}" width="${(lineEndX - lineStartX) * 0.7}" height="${lineHeight}" rx="${lineHeight / 2}" fill="${ICON_COLOR}" opacity="0.8"/>

  <!-- Row 3: Empty -->
  ${createEmptyCheckboxDark(checkboxX, row3Y - checkboxSize / 2, checkboxSize, ICON_COLOR)}
  <rect x="${lineStartX}" y="${row3Y - lineHeight / 2}" width="${(lineEndX - lineStartX) * 0.85}" height="${lineHeight}" rx="${lineHeight / 2}" fill="${ICON_COLOR}" opacity="0.4"/>
</svg>`;
}

function createCheckedCheckboxDark(x, y, size, color) {
  const r = Math.round(size * 0.2);
  const strokeW = Math.max(2, Math.round(size * 0.08));
  const cx = x + size / 2;
  const cy = y + size / 2;
  const s = size * 0.3;
  return `
  <rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${r}" ry="${r}" fill="${color}"/>
  <polyline points="${cx - s * 0.8},${cy} ${cx - s * 0.15},${cy + s * 0.7} ${cx + s * 0.9},${cy - s * 0.6}"
    fill="none" stroke="#FFFFFF" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function createEmptyCheckboxDark(x, y, size, color) {
  const r = Math.round(size * 0.2);
  const strokeW = Math.max(2, Math.round(size * 0.08));
  return `
  <rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${r}" ry="${r}" fill="none" stroke="${color}" stroke-width="${strokeW}" opacity="0.5"/>`;
}

function createSplashIconSVG(size) {
  // Splash icon: larger, centered todo checkmark
  const centerX = size / 2;
  const centerY = size / 2;
  const circleR = size * 0.38;
  const strokeW = Math.round(size * 0.035);

  const s = size * 0.15;
  const cx = centerX;
  const cy = centerY;

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="splashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${PRIMARY_COLOR};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${PRIMARY_DARK};stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Circle background -->
  <circle cx="${centerX}" cy="${centerY}" r="${circleR}" fill="url(#splashGrad)"/>

  <!-- Big checkmark -->
  <polyline points="${cx - s * 1.2},${cy + s * 0.1} ${cx - s * 0.2},${cy + s * 1.0} ${cx + s * 1.4},${cy - s * 0.9}"
    fill="none" stroke="${CHECK_COLOR}" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}

function createFaviconSVG(size) {
  // Simple checkmark in a rounded square for favicon
  const margin = Math.round(size * 0.08);
  const bgSize = size - margin * 2;
  const r = Math.round(bgSize * 0.22);
  const centerX = size / 2;
  const centerY = size / 2;
  const s = size * 0.18;
  const strokeW = Math.max(2, Math.round(size * 0.06));

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="favGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${PRIMARY_COLOR};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${PRIMARY_DARK};stop-opacity:1" />
    </linearGradient>
  </defs>

  <rect x="${margin}" y="${margin}" width="${bgSize}" height="${bgSize}" rx="${r}" ry="${r}" fill="url(#favGrad)"/>

  <polyline points="${centerX - s * 1.0},${centerY + s * 0.1} ${centerX - s * 0.15},${centerY + s * 0.9} ${centerX + s * 1.2},${centerY - s * 0.8}"
    fill="none" stroke="${CHECK_COLOR}" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}

async function generateIcons() {
  console.log('Generating Todo App icons...\n');

  // 1. Main app icon (1024x1024)
  console.log('1. Generating icon.png (1024x1024)...');
  const iconSVG = createIconSVG(1024);
  await sharp(Buffer.from(iconSVG))
    .png()
    .toFile(path.join(ASSETS_DIR, 'icon.png'));
  console.log('   Done!');

  // 2. Adaptive icon foreground (1024x1024)
  console.log('2. Generating adaptive-icon.png (1024x1024)...');
  const adaptiveSVG = createAdaptiveIconSVG(1024);
  await sharp(Buffer.from(adaptiveSVG))
    .png()
    .toFile(path.join(ASSETS_DIR, 'adaptive-icon.png'));
  console.log('   Done!');

  // 3. Splash screen icon (1024x1024)
  console.log('3. Generating splash-icon.png (1024x1024)...');
  const splashSVG = createSplashIconSVG(1024);
  await sharp(Buffer.from(splashSVG))
    .png()
    .toFile(path.join(ASSETS_DIR, 'splash-icon.png'));
  console.log('   Done!');

  // 4. Favicon (48x48)
  console.log('4. Generating favicon.png (48x48)...');
  const faviconSVG = createFaviconSVG(48);
  await sharp(Buffer.from(faviconSVG))
    .png()
    .toFile(path.join(ASSETS_DIR, 'favicon.png'));
  console.log('   Done!');

  console.log('\nAll icons generated successfully!');
  console.log(`Files saved to: ${ASSETS_DIR}`);
}

generateIcons().catch(console.error);
