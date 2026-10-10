import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, '../src/data/products.json');

// Read existing fashion items from generateProductsCatalog.js
import { fashionProducts } from './categories/fashion.js';
import { mobilesProducts } from './categories/mobiles.js';
import { electronicsProducts } from './categories/electronics.js';
import { beautyProducts } from './categories/beauty.js';
import { homeProducts } from './categories/home.js';
import { appliancesProducts } from './categories/appliances.js';
import { toysProducts } from './categories/toys.js';
import { foodHealthProducts } from './categories/foodHealth.js';
import { autoAccProducts } from './categories/autoAcc.js';
import { sportsProducts } from './categories/sports.js';
import { furnitureProducts } from './categories/furniture.js';

const all = [
  ...fashionProducts,
  ...mobilesProducts,
  ...electronicsProducts,
  ...beautyProducts,
  ...homeProducts,
  ...appliancesProducts,
  ...toysProducts,
  ...foodHealthProducts,
  ...autoAccProducts,
  ...sportsProducts,
  ...furnitureProducts
];

console.log('Total products:', all.length);
const categoryCounts = {};
all.forEach(p => {
  categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
});
console.log('Category breakdown:', categoryCounts);
const forYouCount = all.filter(p => p.featuredForYou).length;
console.log('For You count:', forYouCount);

fs.writeFileSync(outputPath, JSON.stringify(all, null, 2), 'utf8');
console.log('Successfully written to', outputPath);
