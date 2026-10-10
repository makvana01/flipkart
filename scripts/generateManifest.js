import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsPath = path.resolve(__dirname, '../src/data/products.json');
const manifestPath = path.resolve(__dirname, 'imageManifest.json');
const productsDir = path.resolve(__dirname, '../public/assets/images/products');

if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
}

const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

const getPrompt = (p) => {
  const name = p.fullTitle || p.title;
  const cat = (p.category || '').toLowerCase();

  if (cat.includes('mobile')) {
    return `Commercial e-commerce studio product photograph of ${name}. Ultra-sleek premium smartphone design, elegant glass and metal finish, crystal clear display, clean minimalist pure white studio background, softbox lighting, 8k sharp focus, Flipkart catalog standard.`;
  }
  if (cat.includes('fashion')) {
    return `Commercial e-commerce fashion product photograph of ${name}. High-end garment or footwear detailing, authentic fabric texture, clean soft-gray seamless studio background, bright fashion lighting, 8k resolution, centered composition.`;
  }
  if (cat.includes('electronic')) {
    return `Commercial e-commerce studio photograph of ${name}. High-performance audio or gadget finish, pristine details, clean white studio background, professional soft lighting, 8k ultra-sharp focus.`;
  }
  if (cat.includes('beauty')) {
    return `Commercial cosmetics studio product photograph of ${name}. Luxury skincare or beauty cosmetic packaging, clean white minimalist studio background with subtle soft shadow, gentle studio illumination, 8k crisp clarity.`;
  }
  if (cat.includes('home')) {
    return `Commercial home decor and utility product photograph of ${name}. High quality material and craftsmanship, clean modern bright setting, warm professional lighting, 8k sharp resolution.`;
  }
  if (cat.includes('appliance')) {
    return `Commercial home appliance studio photograph of ${name}. Premium durable build, polished finish, clean white seamless background, professional studio lighting, 8k resolution.`;
  }
  if (cat.includes('toy')) {
    return `Commercial studio product photograph of ${name}. Vibrant toy design, safe rounded contours, crisp detailing, pure white studio background, bright softbox lighting, 8k quality.`;
  }
  if (cat.includes('food') || cat.includes('health')) {
    return `Commercial health and nutrition product photograph of ${name}. Clean authentic retail jar or packaging, pure white studio background, crisp focus, vibrant natural colors, 8k resolution.`;
  }
  if (cat.includes('auto')) {
    return `Commercial automotive accessory product photograph of ${name}. Tough heavy-duty build, industrial quality, clean studio background, sharp focused lighting, 8k clarity.`;
  }
  if (cat.includes('sport')) {
    return `Commercial fitness equipment product photograph of ${name}. High durability athletic gear, clean seamless backdrop, crisp lighting, 8k high-definition detail.`;
  }
  if (cat.includes('furniture')) {
    return `Commercial furniture catalog photograph of ${name}. Modern interior aesthetic, clean room ambiance, fine wood or metal textures, soft natural lighting, 8k sharp resolution.`;
  }
  return `Commercial e-commerce studio product photograph of ${name}. Clean white studio background, softbox lighting, 8k resolution, centered product view.`;
};

const manifest = products.map((p, index) => {
  const fileName = `${p.id}.jpg`;
  const relativePath = `/assets/images/products/${fileName}`;
  const absolutePath = path.resolve(productsDir, fileName);
  const exists = fs.existsSync(absolutePath);

  return {
    index: index + 1,
    id: p.id,
    category: p.category,
    title: p.title,
    fullTitle: p.fullTitle,
    targetFile: fileName,
    relativePath,
    existsOnDisk: exists,
    status: exists ? 'ready' : 'pending',
    currentImage: p.image,
    prompt: getPrompt(p)
  };
});

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

const readyCount = manifest.filter(m => m.existsOnDisk).length;
console.log(`Manifest created at ${manifestPath}`);
console.log(`Total Products: ${manifest.length}`);
console.log(`Ready on disk: ${readyCount}`);
console.log(`Pending generation: ${manifest.length - readyCount}`);
