import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsPath = path.resolve(__dirname, '../src/data/products.json');
const productsDir = path.resolve(__dirname, '../public/assets/images/products');

const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

let linkedCount = 0;
let unchangedCount = 0;

const updated = products.map(p => {
  const photoFile = `${p.id}.jpg`;
  const photoAbs = path.resolve(productsDir, photoFile);
  const photoRel = `/assets/images/products/${photoFile}`;

  if (fs.existsSync(photoAbs)) {
    linkedCount++;
    const gallery = Array.isArray(p.gallery) ? [...p.gallery] : [];
    if (!gallery.includes(photoRel)) {
      gallery.unshift(photoRel);
    }
    return {
      ...p,
      image: photoRel,
      gallery
    };
  } else {
    unchangedCount++;
    return p;
  }
});

fs.writeFileSync(productsPath, JSON.stringify(updated, null, 2), 'utf8');

console.log(`Auto-Linker Finished:`);
console.log(`- Linked new original photos: ${linkedCount} products`);
console.log(`- Safe fallback preserved: ${unchangedCount} products`);
console.log(`- Total Catalog Products: ${updated.length}`);
