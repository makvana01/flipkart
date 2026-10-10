import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsPath = path.resolve(__dirname, '../src/data/products.json');
const productsDir = path.resolve(__dirname, '../public/assets/images/products');

if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
}

const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

function cleanProductTitle(raw) {
  return raw
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\b\d+\s*GB\b/gi, '')
    .replace(/\b\d+\s*TB\b/gi, '')
    .replace(/\b5G\b/gi, '')
    .replace(/\b4G\b/gi, '')
    .replace(/\bROM\b/gi, '')
    .replace(/\bRAM\b/gi, '')
    .replace(/\bwith\s+Wi-Fi.*$/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function getImageUrlBing(query) {
  try {
    const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query + ' product')}&form=HDRSC2&first=1`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    if (!res.ok) return null;
    const html = await res.text();
    const regex = /murl&quot;:&quot;(https?:\/\/[^&"]+?\.(?:jpg|jpeg|png|webp))/gi;
    const matches = [];
    let m;
    while ((m = regex.exec(html)) !== null) {
      matches.push(m[1]);
    }
    if (matches.length === 0) return null;

    // Prefer high-res retail or clean catalog image
    const preferred = matches.find(u =>
      u.includes('flixcart.com') ||
      u.includes('media-amazon.com') ||
      u.includes('apple.com') ||
      u.includes('samsung.com') ||
      u.includes('myntra') ||
      u.includes('croma')
    ) || matches[0];

    return preferred;
  } catch (err) {
    return null;
  }
}

async function getImageUrlDdg(query) {
  try {
    const initUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
    const initRes = await fetch(initUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const html = await initRes.text();
    const match = html.match(/vqd=([0-9-]+)/) || html.match(/vqd="([0-9-]+)"/) || html.match(/vqd=([a-zA-Z0-9_-]+)/);
    if (!match) return null;
    const vqd = match[1];

    const imgApiUrl = `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,`;
    const res = await fetch(imgApiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://duckduckgo.com/'
      }
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.results || data.results.length === 0) return null;
    return data.results[0].image;
  } catch (err) {
    return null;
  }
}

async function downloadImageToDisk(url, destPath) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      },
      signal: controller.signal
    });
    clearTimeout(timer);
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 3500) return false;
    fs.writeFileSync(destPath, buf);
    return true;
  } catch (err) {
    clearTimeout(timer);
    return false;
  }
}

const targetCat = process.argv[2] ? process.argv[2].toLowerCase() : null;

async function run() {
  console.log('================================================================');
  console.log(`Starting Product-Wise Original Photo Downloader (Dual-Engine)`);
  console.log(`Target: 220 Products | Category: ${targetCat || 'ALL 11 CATEGORIES'}`);
  console.log('================================================================\n');

  let downloadedCount = 0;
  let skippedCount = 0;
  let fallbackCount = 0;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    if (targetCat && !(p.category || '').toLowerCase().includes(targetCat)) {
      continue;
    }

    const fileName = `${p.id}.jpg`;
    const destPath = path.resolve(productsDir, fileName);
    const relPath = `/assets/images/products/${fileName}`;

    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 4000) {
      p.image = relPath;
      if (!p.gallery.includes(relPath)) p.gallery.unshift(relPath);
      skippedCount++;
      console.log(`[${i + 1}/220] ${p.id} (${p.category}) - already downloaded (${fs.statSync(destPath).size} B)`);
      continue;
    }

    const cleanTitle = cleanProductTitle(p.title);
    console.log(`[${i + 1}/220] Fetching for [${p.category}] ${p.id}: "${cleanTitle}"...`);

    // Engine 1: Bing Image Search
    let imgUrl = await getImageUrlBing(cleanTitle);

    // Engine 2: DDG fallback if needed
    if (!imgUrl) {
      imgUrl = await getImageUrlDdg(cleanTitle);
    }

    if (imgUrl) {
      const ok = await downloadImageToDisk(imgUrl, destPath);
      if (ok) {
        p.image = relPath;
        if (!p.gallery.includes(relPath)) p.gallery.unshift(relPath);
        downloadedCount++;
        console.log(`  ✓ Saved ${fileName} (${fs.statSync(destPath).size} bytes) from ${imgUrl.slice(0, 45)}...`);
      } else {
        fallbackCount++;
        console.log(`  ⚠ Download failed from ${imgUrl.slice(0, 50)}... Keeping fallback.`);
      }
    } else {
      fallbackCount++;
      console.log(`  ⚠ No image found for "${cleanTitle}". Keeping fallback.`);
    }

    // Save catalog incrementally
    if ((i + 1) % 5 === 0 || i === products.length - 1) {
      fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
    }

    // Polite delay
    await sleep(600);
  }

  // Save final state
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');

  console.log('\n================================================================');
  console.log(`Batch Summary:`);
  console.log(`- Downloaded New: ${downloadedCount}`);
  console.log(`- Pre-existing / Cached: ${skippedCount}`);
  console.log(`- Kept Safe Fallback: ${fallbackCount}`);
  console.log('================================================================\n');
}

run();
