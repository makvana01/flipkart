import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsDir = path.resolve(__dirname, '../public/assets/images/products');

async function getImageUrl(query) {
  try {
    const initUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query + ' product')}`;
    const initRes = await fetch(initUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await initRes.text();
    const match = html.match(/vqd=([0-9-]+)/) || html.match(/vqd="([0-9-]+)"/) || html.match(/vqd=([a-zA-Z0-9_-]+)/);
    if (!match) return null;
    const vqd = match[1];

    const imgApiUrl = `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query + ' flipkart')}&vqd=${vqd}&f=,,,`;
    const res = await fetch(imgApiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://duckduckgo.com/'
      }
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.results || data.results.length === 0) return null;

    // Prefer flixcart / flipkart CDN or clean retail image
    const flipkartResult = data.results.find(r => r.image && r.image.includes('flixcart.com'));
    if (flipkartResult) return flipkartResult.image;

    return data.results[0].image;
  } catch (e) {
    return null;
  }
}

async function downloadFile(url, dest) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      signal: controller.signal
    });
    clearTimeout(timer);
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 3000) return false;
    fs.writeFileSync(dest, buf);
    return true;
  } catch (e) {
    clearTimeout(timer);
    return false;
  }
}

async function test() {
  const items = [
    { id: 'mob_01', title: 'Apple iPhone 16 Pro Max Desert Titanium' },
    { id: 'elec_01', title: 'JBL Flip 6 Wireless Bluetooth Speaker' }
  ];

  for (const item of items) {
    console.log(`Searching for: ${item.title}...`);
    const imgUrl = await getImageUrl(item.title);
    console.log(`URL: ${imgUrl}`);
    if (imgUrl) {
      const dest = path.resolve(productsDir, `${item.id}.jpg`);
      const ok = await downloadFile(imgUrl, dest);
      console.log(`Downloaded ${item.id}.jpg:`, ok, `Size: ${ok ? fs.statSync(dest).size : 0} bytes`);
    }
  }
}

test();
