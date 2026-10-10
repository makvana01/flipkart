import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsPath = path.resolve(__dirname, '../src/data/products.json');

const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

const targetCats = [
  'Fashion',
  'Beauty',
  'Home',
  'Appliances',
  'Toys, baby..',
  'Food & Health',
  'Auto Acc...',
  'Sports & Fitness',
  'Furniture'
];

let updatedCount = 0;
let untouchedCount = 0;

targetCats.forEach(cat => {
  const items = products.filter(p => p.category === cat);
  const min = Math.min(...items.map(p => p.price));
  const max = Math.max(...items.map(p => p.price));

  items.forEach(p => {
    const norm = (p.price - min) / (max - min || 1);
    let scaled = 399 + norm * (999 - 399);
    // Round to standard Indian e-commerce price ending in 9 (e.g. 399, 449, 499, etc.)
    scaled = Math.round(scaled / 10) * 10 - 1;
    if (scaled < 399) scaled = 399;
    if (scaled > 999) scaled = 999;

    p.price = scaled;

    // Calculate realistic MRP origPrice (e.g., 55% - 75% discount)
    const multiplier = 2.0 + (p.id.charCodeAt(p.id.length - 1) % 5) * 0.2;
    let orig = Math.round((scaled * multiplier) / 50) * 50 - 1;
    if (orig <= scaled) orig = scaled + 900;
    p.origPrice = orig;

    const discountPercent = Math.round((1 - scaled / orig) * 100);
    p.discount = `${discountPercent}% off`;

    p.emiPerMonth = Math.round(scaled / 6);

    if (p.offer) {
      const upiDiscount = Math.min(25, Math.round(scaled * 0.03));
      p.offer = `₹${scaled - upiDiscount} with UPI offer`;
    }

    updatedCount++;
  });
});

products.forEach(p => {
  if (!targetCats.includes(p.category)) {
    untouchedCount++;
  }
});

fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');

console.log('================================================================');
console.log('Price Adjustment Complete:');
console.log(`- Updated Categories (399 to 999): ${targetCats.length} categories (${updatedCount} products)`);
console.log(`- Untouched Categories (Mobiles & Electronics): ${untouchedCount} products`);
console.log('================================================================');
