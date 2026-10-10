import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manifestPath = path.resolve(__dirname, 'imageManifest.json');
const productsDir = path.resolve(__dirname, '../public/assets/images/products');

if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
}

const apiKey = process.env.GEMINI_API_KEY || process.argv[2];

if (!apiKey) {
  console.log(`
=============================================================================
❌ ERROR: GEMINI_API_KEY is not provided!

Usage:
  Option 1: Pass key as argument:
    node scripts/batchGeminiGen.js YOUR_API_KEY [category_filter]

  Option 2: Set environment variable:
    $env:GEMINI_API_KEY="YOUR_API_KEY"
    node scripts/batchGeminiGen.js [category_filter]

Example:
  node scripts/batchGeminiGen.js AIzaSy... Mobiles
=============================================================================
  `);
  process.exit(1);
}

const categoryFilter = process.argv[3] || (process.argv[2] && process.argv[2] !== apiKey ? process.argv[2] : null);

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

let targetList = manifest.filter(item => {
  const fileAbs = path.resolve(productsDir, item.targetFile);
  const exists = fs.existsSync(fileAbs);
  if (exists) return false;
  if (categoryFilter) {
    return item.category.toLowerCase().includes(categoryFilter.toLowerCase());
  }
  return true;
});

console.log(`\nFound ${targetList.length} pending images to generate.`);

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function generateImage(item) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

  const payload = {
    instances: [{ prompt: item.prompt }],
    parameters: {
      sampleCount: 1,
      aspectRatio: "1:1",
      personGeneration: "allow_adult"
    }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP ${res.status}: ${errorText}`);
  }

  const json = await res.json();
  const b64 = json.predictions?.[0]?.bytesBase64Encoded;
  if (!b64) throw new Error('No image bytes returned in response');

  const outPath = path.resolve(productsDir, item.targetFile);
  fs.writeFileSync(outPath, Buffer.from(b64, 'base64'));
  console.log(`✓ [${item.category}] Saved ${item.targetFile} (${item.title.slice(0, 35)}...)`);
}

async function runBatch() {
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < targetList.length; i++) {
    const item = targetList[i];
    console.log(`[${i + 1}/${targetList.length}] Generating for: ${item.id} - ${item.title}...`);
    try {
      await generateImage(item);
      successCount++;
      // Polite rate delay
      await sleep(1200);
    } catch (err) {
      console.error(`✗ Error on ${item.id}:`, err.message);
      failCount++;
      if (err.message.includes('429')) {
        console.log('Hit rate limit, waiting 10 seconds before continuing...');
        await sleep(10000);
      }
    }
  }

  console.log(`\nBatch Complete! Success: ${successCount}, Failed: ${failCount}`);
  console.log(`Now updating products catalog...`);
  const { execSync } = await import('child_process');
  execSync('node scripts/linkProductImages.js', { stdio: 'inherit' });
}

runBatch();
