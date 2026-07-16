/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'public', 'images');

const filesToGenerate = [
  // Hero
  { dir: 'hero', name: 'slide-1.svg', text: 'Hero Slide 1', sub: 'Warm Collection' },
  { dir: 'hero', name: 'slide-2.svg', text: 'Hero Slide 2', sub: 'Kitchen Essentials' },
  { dir: 'hero', name: 'slide-3.svg', text: 'Hero Slide 3', sub: 'Ambient Textures' },

  // Categories
  { dir: 'categories', name: 'living-room.svg', text: 'Living Room', sub: 'Category Card' },
  { dir: 'categories', name: 'bedroom.svg', text: 'Bedroom', sub: 'Category Card' },
  { dir: 'categories', name: 'kitchen.svg', text: 'Kitchen', sub: 'Category Card' },
  { dir: 'categories', name: 'bathroom.svg', text: 'Bathroom', sub: 'Category Card' },
  { dir: 'categories', name: 'office.svg', text: 'Office', sub: 'Category Card' },
  { dir: 'categories', name: 'decoration.svg', text: 'Decoration', sub: 'Category Card' },

  // Rooms
  { dir: 'rooms', name: 'living-room.svg', text: 'Living Room Space', sub: 'Shop by Room' },
  { dir: 'rooms', name: 'kitchen.svg', text: 'Kitchen Space', sub: 'Shop by Room' },
  { dir: 'rooms', name: 'bedroom.svg', text: 'Bedroom Space', sub: 'Shop by Room' },
  { dir: 'rooms', name: 'dining-room.svg', text: 'Dining Space', sub: 'Shop by Room' },
  { dir: 'rooms', name: 'bathroom.svg', text: 'Bathroom Space', sub: 'Shop by Room' },
  { dir: 'rooms', name: 'office.svg', text: 'Office Space', sub: 'Shop by Room' },

  // Products
  { dir: 'products', name: 'prod1-1.svg', text: 'Aurelia Light', sub: 'Primary Angle' },
  { dir: 'products', name: 'prod1-2.svg', text: 'Aurelia Light', sub: 'Secondary Angle' },
  { dir: 'products', name: 'prod2-1.svg', text: 'Sienna Tray', sub: 'Primary Angle' },
  { dir: 'products', name: 'prod2-2.svg', text: 'Sienna Tray', sub: 'Secondary Angle' },
  { dir: 'products', name: 'prod3-1.svg', text: 'Lounge Throw', sub: 'Primary Angle' },
  { dir: 'products', name: 'prod3-2.svg', text: 'Lounge Throw', sub: 'Secondary Angle' },
  { dir: 'products', name: 'prod4-1.svg', text: 'Noir Candle', sub: 'Primary Angle' },
  { dir: 'products', name: 'prod4-2.svg', text: 'Noir Candle', sub: 'Secondary Angle' },
  { dir: 'products', name: 'prod5-1.svg', text: 'Linen Sham Set', sub: 'Primary Angle' },
  { dir: 'products', name: 'prod5-2.svg', text: 'Linen Sham Set', sub: 'Secondary Angle' },
  { dir: 'products', name: 'prod6-1.svg', text: 'Walnut Bowl', sub: 'Primary Angle' },
  { dir: 'products', name: 'prod6-2.svg', text: 'Walnut Bowl', sub: 'Secondary Angle' },
  { dir: 'products', name: 'prod7-1.svg', text: 'Alabaster Vase', sub: 'Primary Angle' },
  { dir: 'products', name: 'prod7-2.svg', text: 'Alabaster Vase', sub: 'Secondary Angle' },
  { dir: 'products', name: 'prod8-1.svg', text: 'Kyoto Tea Set', sub: 'Primary Angle' },
  { dir: 'products', name: 'prod8-2.svg', text: 'Kyoto Tea Set', sub: 'Secondary Angle' },

  // Testimonials
  { dir: 'testimonials', name: 'avatar-1.svg', text: 'EV', sub: 'Eleanor Vance' },
  { dir: 'testimonials', name: 'avatar-2.svg', text: 'MA', sub: 'Marcus Aurelius' },
  { dir: 'testimonials', name: 'avatar-3.svg', text: 'SL', sub: 'Sophia Loren' },

  // Instagram
  { dir: 'instagram', name: 'post-1.svg', text: 'Insta Post 1', sub: '#HomiqTrends' },
  { dir: 'instagram', name: 'post-2.svg', text: 'Insta Post 2', sub: '#HomiqTrends' },
  { dir: 'instagram', name: 'post-3.svg', text: 'Insta Post 3', sub: '#HomiqTrends' },
  { dir: 'instagram', name: 'post-4.svg', text: 'Insta Post 4', sub: '#HomiqTrends' },
  { dir: 'instagram', name: 'post-5.svg', text: 'Insta Post 5', sub: '#HomiqTrends' },
  { dir: 'instagram', name: 'post-6.svg', text: 'Insta Post 6', sub: '#HomiqTrends' },
  { dir: 'instagram', name: 'post-7.svg', text: 'Insta Post 7', sub: '#HomiqTrends' },
  { dir: 'instagram', name: 'post-8.svg', text: 'Insta Post 8', sub: '#HomiqTrends' }
];

filesToGenerate.forEach(f => {
  const targetDir = path.join(baseDir, f.dir);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  let width = 800;
  let height = 600;
  let isAvatar = f.dir === 'testimonials';
  if (isAvatar) {
    width = 150;
    height = 150;
  } else if (f.dir === 'products' || f.dir === 'instagram') {
    width = 600;
    height = 750;
  }

  const svgContent = isAvatar ? `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#EEDCCB"/>
  <circle cx="75" cy="75" r="50" fill="#DFC1A5"/>
  <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="28" font-weight="bold" fill="#1F1F1F">${f.text}</text>
</svg>
` : `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
  <rect width="100%" height="100%" fill="#F8F5F2"/>
  <rect x="8%" y="8%" width="84%" height="84%" fill="none" stroke="#D9B79A" stroke-width="2" stroke-dasharray="10 5"/>
  <text x="50%" y="46%" dominant-baseline="middle" text-anchor="middle" font-family="serif" font-size="24" font-weight="bold" fill="#1F1F1F">${f.text}</text>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#666666">${f.sub}</text>
</svg>
`;

  fs.writeFileSync(path.join(targetDir, f.name), svgContent.trim());
});

console.log('All dummy SVG reference placeholder images generated successfully!');
