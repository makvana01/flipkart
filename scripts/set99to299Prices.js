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

// Realistic e-commerce prices strictly between 99 and 299, mostly 199 (10 of 20 around 199)
const priceDistribution = [
  99, 119, 139, 149, 159,
  179, 189, 199, 199, 199,
  199, 199, 219, 229, 239,
  249, 259, 279, 289, 299
];

let updatedCount = 0;
let untouchedCount = 0;

targetCats.forEach(cat => {
  const items = products.filter(p => p.category === cat);

  // Sort items by current price so relative hierarchy is preserved
  items.sort((a, b) => a.price - b.price);

  items.forEach((p, index) => {
    const newPrice = priceDistribution[index];
    p.price = newPrice;

    // Realistic origPrice MRP (e.g. ₹499 to ₹1,299)
    const multiplier = 3.0 + (p.id.charCodeAt(p.id.length - 1) % 4) * 0.5;
    let orig = Math.round((newPrice * multiplier) / 50) * 50 - 1;
    if (orig < 499) orig = 499;
    p.origPrice = orig;

    const discountPercent = Math.round((1 - newPrice / orig) * 100);
    p.discount = `${discountPercent}% off`;

    // EMI & Offer
    p.emiPerMonth = Math.round(newPrice / 3);
    p.offer = `₹${newPrice - 10} with UPI offer`;

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
console.log('Price Adjustment Complete (99 to 299, mostly 199):');
console.log(`- Updated Categories: ${targetCats.length} categories (${updatedCount} products)`);
console.log(`- Untouched Categories (Mobiles & Electronics): ${untouchedCount} products`);
console.log('================================================================');
