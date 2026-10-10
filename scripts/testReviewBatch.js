import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsPath = path.resolve(__dirname, '../src/data/products.json');
const reviewsDir = path.resolve(__dirname, '../public/assets/images/reviews');

if (!fs.existsSync(reviewsDir)) {
  fs.mkdirSync(reviewsDir, { recursive: true });
}

const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

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
    .replace(/\s+/g, ' ')
    .trim();
}

async function getReviewPhotoUrl(title, category) {
  const clean = cleanProductTitle(title);
  const queries = [
    `${clean} flipkart customer review photo`,
    `${clean} real buyer unboxing review photo`,
    `${clean} customer review photo`
  ];

  for (const q of queries) {
    try {
      const url = `https://www.bing.com/images/search?q=${encodeURIComponent(q)}&form=HDRSC2&first=1`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });
      if (!res.ok) continue;
      const html = await res.text();
      const regex = /murl&quot;:&quot;(https?:\/\/[^&"]+?\.(?:jpg|jpeg|png|webp))/gi;
      const matches = [];
      let m;
      while ((m = regex.exec(html)) !== null) {
        matches.push(m[1]);
      }
      if (matches.length === 0) continue;

      // Filter for review-like or unboxing images
      const reviewMatch = matches.find(u =>
        u.includes('review') ||
        u.includes('unbox') ||
        u.includes('ytimg') ||
        u.includes('flixcart') ||
        u.includes('media-amazon') ||
        u.includes('buyer') ||
        u.includes('customer')
      ) || matches[1] || matches[0];

      return reviewMatch;
    } catch (e) {}
  }
  return null;
}

async function downloadImage(url, dest) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    clearTimeout(timeout);
    if (!res.ok) return false;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (buffer.length < 3000) return false;
    fs.writeFileSync(dest, buffer);
    return true;
  } catch (e) {
    return false;
  }
}

async function test() {
  const sample = products.slice(0, 5);
  for (const p of sample) {
    console.log(`Testing [${p.id}] ${p.title}...`);
    const imgUrl = await getReviewPhotoUrl(p.title, p.category);
    console.log(`Found URL:`, imgUrl);
    if (imgUrl) {
      const dest = path.join(reviewsDir, `rev_${p.id}.jpg`);
      const ok = await downloadImage(imgUrl, dest);
      console.log(`Download status: ${ok ? 'SUCCESS' : 'FAILED'} (size: ${ok ? fs.statSync(dest).size : 0} bytes)`);
    }
  }
}

test();
