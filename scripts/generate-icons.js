const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ASSETS_DIR = path.join(__dirname, '..', 'assets', 'images');

// Todo App brand colors
const PRIMARY_COLOR = '#6C5CE7';
const PRIMARY_DARK = '#5A4BD4';
const PRIMARY_LIGHT = '#A29BFE';
const BG_COLOR = '#FFFFFF';
const CHECK_COLOR = '#FFFFFF';

function createIconSVG(size) {
  const padding = Math.round(size * 0.12);
  const iconArea = size - padding * 2;
  const centerX = size / 2;
  const centerY = size / 2;

  const bgRoundRadius = Math.round(size * 0.22);
  const bgMargin = Math.round(size * 0.03);

  const checkboxSize = Math.round(iconArea * 0.2);
  const checkboxX = centerX - Math.round(iconArea * 0.26);
  const lineStartX = centerX - Math.round(iconArea * 0.06);
  const lineEndX = centerX + Math.round(iconArea * 0.3);
  const lineHeight = Math.round(iconArea * 0.038);
  const rowSpacing = Math.round(iconArea * 0.21);

  const row1Y = centerY - rowSpacing;
  const row2Y = centerY;
  const row3Y = centerY + rowSpacing;

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${PRIMARY_COLOR};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${PRIMARY_DARK};stop-opacity:1" />
    </linearGradient>
    <linearGradient id="shineGrad" x1="0%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:0.2" />
      <stop offset="100%" style="stop-color:#FFFFFF;stop-opacity:0" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="${Math.round(size * 0.01)}" stdDeviation="${Math.round(size * 0.02)}" flood-color="#000000" flood-opacity="0.15"/>
    </filter>
  </defs>

  <!-- Background rounded rect -->
  <rect x="${bgMargin}" y="${bgMargin}" width="${size - bgMargin * 2}" height="${size - bgMargin * 2}" rx="${bgRoundRadius}" ry="${bgRoundRadius}" fill="url(#bgGrad)"/>

  <!-- Subtle shine overlay -->
  <rect x="${bgMargin}" y="${bgMargin}" width="${size - bgMargin * 2}" height="${(size - bgMargin * 2) * 0.55}" rx="${bgRoundRadius}" ry="${bgRoundRadius}" fill="url(#shineGrad)"/>

  <!-- Row 1: Checked checkbox + line -->
  <g filter="url(#shadow)">
    ${createCheckedCheckbox(checkboxX, row1Y - checkboxSize / 2, checkboxSize)}
    <rect x="${lineStartX}" y="${row1Y - lineHeight / 2}" width="${lineEndX - lineStartX}" height="${lineHeight}" rx="${lineHeight / 2}" fill="${CHECK_COLOR}" opacity="0.95"/>
  </g>

  <!-- Row 2: Checked checkbox + shorter line -->
  <g filter="url(#shadow)">
    ${createCheckedCheckbox(checkboxX, row2Y - checkboxSize / 2, checkboxSize)}
    <rect x="${lineStartX}" y="${row2Y - lineHeight / 2}" width="${(lineEndX - lineStartX) * 0.7}" height="${lineHeight}" rx="${lineHeight / 2}" fill="${CHECK_COLOR}" opacity="0.95"/>
  </g>

  <!-- Row 3: Empty checkbox + line (pending task) -->
  <g>
    ${createEmptyCheckbox(checkboxX, row3Y - checkboxSize / 2, checkboxSize)}
    <rect x="${lineStartX}" y="${row3Y - lineHeight / 2}" width="${(lineEndX - lineStartX) * 0.85}" height="${lineHeight}" rx="${lineHeight / 2}" fill="${CHECK_COLOR}" opacity="0.45"/>
  </g>
</svg>`;
}

function createCheckedCheckbox(x, y, size) {
  const r = Math.round(size * 0.22);
  const strokeW = Math.max(2, Math.round(size * 0.09));
  const cx = x + size / 2;
  const cy = y + size / 2;
  const s = size * 0.3;
  return `
  <rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${r}" ry="${r}" fill="${CHECK_COLOR}"/>
  <polyline points="${cx - s * 0.8},${cy} ${cx - s * 0.15},${cy + s * 0.7} ${cx + s * 0.9},${cy - s * 0.6}"
    fill="none" stroke="${PRIMARY_COLOR}" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function createEmptyCheckbox(x, y, size) {
  const r = Math.round(size * 0.22);
  const strokeW = Math.max(2, Math.round(size * 0.08));
  return `
  <rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${r}" ry="${r}" fill="none" stroke="${CHECK_COLOR}" stroke-width="${strokeW}" opacity="0.6"/>`;
}

function createAdaptiveIconSVG(size) {
  // Android adaptive icon: foreground only, no background
  // Safe zone is ~66% of canvas
  const safeZone = size * 0.66;
  const centerX = size / 2;
  const centerY = size / 2;
  const iconArea = safeZone * 0.75;

  const checkboxSize = Math.round(iconArea * 0.2);
  const checkboxX = centerX - Math.round(iconArea * 0.26);
  const lineStartX = centerX - Math.round(iconArea * 0.06);
  const lineEndX = centerX + Math.round(iconArea * 0.3);
  const lineHeight = Math.round(iconArea * 0.04);
  const rowSpacing = Math.round(iconArea * 0.22);

  const row1Y = centerY - rowSpacing;
  const row2Y = centerY;
  const row3Y = centerY + rowSpacing;

  const ICON_COLOR = PRIMARY_COLOR;

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Row 1: Checked -->
  ${createCheckedCheckboxDark(checkboxX, row1Y - checkboxSize / 2, checkboxSize, ICON_COLOR)}
  <rect x="${lineStartX}" y="${row1Y - lineHeight / 2}" width="${lineEndX - lineStartX}" height="${lineHeight}" rx="${lineHeight / 2}" fill="${ICON_COLOR}" opacity="0.85"/>

  <!-- Row 2: Checked -->
  ${createCheckedCheckboxDark(checkboxX, row2Y - checkboxSize / 2, checkboxSize, ICON_COLOR)}
  <rect x="${lineStartX}" y="${row2Y - lineHeight / 2}" width="${(lineEndX - lineStartX) * 0.7}" height="${lineHeight}" rx="${lineHeight / 2}" fill="${ICON_COLOR}" opacity="0.85"/>

  <!-- Row 3: Empty -->
  ${createEmptyCheckboxDark(checkboxX, row3Y - checkboxSize / 2, checkboxSize, ICON_COLOR)}
  <rect x="${lineStartX}" y="${row3Y - lineHeight / 2}" width="${(lineEndX - lineStartX) * 0.85}" height="${lineHeight}" rx="${lineHeight / 2}" fill="${ICON_COLOR}" opacity="0.35"/>
</svg>`;
}

function createCheckedCheckboxDark(x, y, size, color) {
  const r = Math.round(size * 0.22);
  const strokeW = Math.max(2, Math.round(size * 0.09));
  const cx = x + size / 2;
  const cy = y + size / 2;
  const s = size * 0.3;
  return `
  <rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${r}" ry="${r}" fill="${color}"/>
  <polyline points="${cx - s * 0.8},${cy} ${cx - s * 0.15},${cy + s * 0.7} ${cx + s * 0.9},${cy - s * 0.6}"
    fill="none" stroke="#FFFFFF" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function createEmptyCheckboxDark(x, y, size, color) {
  const r = Math.round(size * 0.22);
  const strokeW = Math.max(2, Math.round(size * 0.08));
  return `
  <rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${r}" ry="${r}" fill="none" stroke="${color}" stroke-width="${strokeW}" opacity="0.45"/>`;
}

function createSplashIconSVG(size) {
  const centerX = size / 2;
  const centerY = size / 2;
  const circleR = size * 0.4;
  const strokeW = Math.round(size * 0.04);

  const s = size * 0.16;
  const cx = centerX;
  const cy = centerY;

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="splashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${PRIMARY_COLOR};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${PRIMARY_DARK};stop-opacity:1" />
    </linearGradient>
    <filter id="splashShadow">
      <feDropShadow dx="0" dy="${Math.round(size * 0.015)}" stdDeviation="${Math.round(size * 0.03)}" flood-color="${PRIMARY_DARK}" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Outer subtle ring -->
  <circle cx="${centerX}" cy="${centerY}" r="${circleR + size * 0.06}" fill="none" stroke="${PRIMARY_LIGHT}" stroke-width="${Math.round(size * 0.005)}" opacity="0.3"/>

  <!-- Circle background with shadow -->
  <circle cx="${centerX}" cy="${centerY}" r="${circleR}" fill="url(#splashGrad)" filter="url(#splashShadow)"/>

  <!-- Shine -->
  <ellipse cx="${centerX - circleR * 0.15}" cy="${centerY - circleR * 0.25}" rx="${circleR * 0.6}" ry="${circleR * 0.35}" fill="white" opacity="0.08"/>

  <!-- Big checkmark -->
  <polyline points="${cx - s * 1.2},${cy + s * 0.1} ${cx - s * 0.2},${cy + s * 1.0} ${cx + s * 1.4},${cy - s * 0.9}"
    fill="none" stroke="${CHECK_COLOR}" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}

function createFaviconSVG(size) {
  const margin = Math.round(size * 0.06);
  const bgSize = size - margin * 2;
  const r = Math.round(bgSize * 0.24);
  const centerX = size / 2;
  const centerY = size / 2;
  const s = size * 0.18;
  const strokeW = Math.max(2, Math.round(size * 0.07));

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

  // Ensure assets directory exists
  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
  }

  // 1. Main app icon (1024x1024) - required by both iOS and Android
  console.log('1. Generating icon.png (1024x1024)...');
  const iconSVG = createIconSVG(1024);
  await sharp(Buffer.from(iconSVG))
    .png({ quality: 100 })
    .toFile(path.join(ASSETS_DIR, 'icon.png'));
  console.log('   Done!');

  // 2. Adaptive icon foreground (1024x1024) - Android only
  console.log('2. Generating adaptive-icon.png (1024x1024)...');
  const adaptiveSVG = createAdaptiveIconSVG(1024);
  await sharp(Buffer.from(adaptiveSVG))
    .png({ quality: 100 })
    .toFile(path.join(ASSETS_DIR, 'adaptive-icon.png'));
  console.log('   Done!');

  // 3. Splash screen icon (1024x1024) - used by expo-splash-screen
  console.log('3. Generating splash-icon.png (1024x1024)...');
  const splashSVG = createSplashIconSVG(1024);
  await sharp(Buffer.from(splashSVG))
    .png({ quality: 100 })
    .toFile(path.join(ASSETS_DIR, 'splash-icon.png'));
  console.log('   Done!');

  // 4. Favicon (48x48) - Web only
  console.log('4. Generating favicon.png (48x48)...');
  const faviconSVG = createFaviconSVG(48);
  await sharp(Buffer.from(faviconSVG))
    .png({ quality: 100 })
    .toFile(path.join(ASSETS_DIR, 'favicon.png'));
  console.log('   Done!');

  console.log('\nAll icons generated successfully!');
  console.log(`Files saved to: ${ASSETS_DIR}`);
}

generateIcons().catch(console.error);
