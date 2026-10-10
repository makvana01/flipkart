import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsPath = path.resolve(__dirname, '../src/data/products.json');
const reviewsDir = path.resolve(__dirname, '../public/assets/images/reviews');
const pdpDir = path.resolve(__dirname, '../public/assets/images/pdp');

if (!fs.existsSync(reviewsDir)) {
  fs.mkdirSync(reviewsDir, { recursive: true });
}

const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

const categoryFallbacks = {
  'Fashion': 'reviews_fashion.jpg',
  'Mobiles': 'customer_review_iphone.png',
  'Electronics': 'customer_review_audio.jpg',
  'Appliances': 'reviews_appliances.jpg',
  'Beauty': 'reviews_beauty.jpg',
  'Home': 'reviews_home.jpg',
  'Toys': 'reviews_toys.jpg',
  'Food & Health': 'reviews_food.jpg',
  'Auto Acc': 'reviews_auto.jpg',
  'Sports': 'reviews_sports.jpg',
  'Furniture': 'reviews_furniture.jpg'
};

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

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function getCandidateUrls(title) {
  const clean = cleanProductTitle(title);
  const queries = [
    `${clean} flipkart customer review photo`,
    `${clean} buyer unboxing review photo`,
    `${clean} real customer in hand photo`
  ];

  const allCandidates = [];

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
      let m;
      while ((m = regex.exec(html)) !== null) {
        if (!allCandidates.includes(m[1])) {
          allCandidates.push(m[1]);
        }
      }
      if (allCandidates.length >= 10) break;
    } catch (e) {}
  }

  // Sort candidates to prioritize genuine review / retail buyer images
  allCandidates.sort((a, b) => {
    const scoreA = (a.includes('review') ? 3 : 0) + (a.includes('flixcart') ? 2 : 0) + (a.includes('unbox') ? 2 : 0) + (a.includes('ytimg') ? 1 : 0);
    const scoreB = (b.includes('review') ? 3 : 0) + (b.includes('flixcart') ? 2 : 0) + (b.includes('unbox') ? 2 : 0) + (b.includes('ytimg') ? 1 : 0);
    return scoreB - scoreA;
  });

  return allCandidates;
}

async function tryDownloadCandidate(url, dest) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    });
    clearTimeout(timer);
    if (!res.ok) return false;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (buffer.length < 3500) return false;

    // Check header signature for JPEG, PNG, or WebP
    const isJpeg = buffer[0] === 0xFF && buffer[1] === 0xD8;
    const isPng = buffer[0] === 0x89 && buffer[1] === 0x50;
    const isRiffWebp = buffer.slice(0, 4).toString('ascii') === 'RIFF';
    if (!isJpeg && !isPng && !isRiffWebp) return false;

    fs.writeFileSync(dest, buffer);
    return true;
  } catch (err) {
    return false;
  }
}

async function applyFallback(category, dest) {
  const fallbackFile = categoryFallbacks[category] || 'reviews_fashion.jpg';
  const sourcePath = path.join(pdpDir, fallbackFile);
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, dest);
    return true;
  }
  const altFallback = path.join(pdpDir, 'customer_review_mosaic.png');
  if (fs.existsSync(altFallback)) {
    fs.copyFileSync(altFallback, dest);
    return true;
  }
  return false;
}

const sampleReviewers = [
  'Aarav Patel', 'Rohit Sharma', 'Pooja Verma', 'Manish Gupta',
  'Sneha Kulkarni', 'Vikram Singh', 'Deepak Mehta', 'Ananya Roy',
  'Jayesh Trivedi', 'Kavita Dave', 'Chirag Joshi', 'Bhavna Parmar',
  'Hardik Shah', 'Priya Nair', 'Sanjay Kumar', 'Ritu Desai'
];

async function main() {
  console.log('================================================================');
  console.log('Starting Review Photo Downloader & Product Review Integrator');
  console.log(`Target: ${products.length} Products | Directory: public/assets/images/reviews`);
  console.log('================================================================\n');

  let downloadedCount = 0;
  let alreadyExisted = 0;
  let fallbackCount = 0;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const indexStr = `[${i + 1}/${products.length}]`;
    const dest = path.join(reviewsDir, `rev_${p.id}.jpg`);
    const webReviewPath = `/assets/images/reviews/rev_${p.id}.jpg`;

    let fileReady = false;

    if (fs.existsSync(dest) && fs.statSync(dest).size > 3500) {
      fileReady = true;
      alreadyExisted++;
      console.log(`${indexStr} ${p.id} (${p.category}): Already ready (${fs.statSync(dest).size} bytes)`);
    } else {
      console.log(`${indexStr} Searching review photo for: "${p.title}"...`);
      const candidates = await getCandidateUrls(p.title);
      let success = false;

      for (let c = 0; c < Math.min(candidates.length, 8); c++) {
        const ok = await tryDownloadCandidate(candidates[c], dest);
        if (ok) {
          success = true;
          downloadedCount++;
          console.log(`  ✓ Saved review photo for ${p.id} (${fs.statSync(dest).size} bytes) from candidate #${c + 1}`);
          break;
        }
      }

      if (!success) {
        applyFallback(p.category, dest);
        fallbackCount++;
        console.log(`  ↳ Applied high-quality category review fallback for ${p.id}`);
      }

      fileReady = true;
      // Polite rate limit sleep
      await sleep(150);
    }

    // Now update review data in product object
    if (!p.reviews || p.reviews.length === 0) {
      const reviewer = sampleReviewers[i % sampleReviewers.length];
      p.reviews = [
        {
          id: `rev_${p.id}_1`,
          rating: 5,
          title: 'Superb quality, fully satisfied!',
          time: '3 days ago',
          comment: 'Received authentic product in pristine condition. Exactly as described, finishing and packaging is top-notch.',
          author: reviewer,
          verified: true,
          likes: 45 + (i % 30),
          dislikes: 2 + (i % 5),
          image: webReviewPath,
          images: [webReviewPath]
        }
      ];
    } else {
      // Enrich existing review with the photo
      p.reviews[0].image = webReviewPath;
      p.reviews[0].images = [webReviewPath];
      if (!p.reviews[0].id) p.reviews[0].id = `rev_${p.id}_1`;
    }

    // Also attach to customerPhotos & customerPhotoMosaic
    p.customerPhotos = [webReviewPath];
    p.customerPhotoMosaic = webReviewPath;
  }

  // Save updated products.json
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');

  console.log('\n================================================================');
  console.log('Completed Review Photo Download & Product Linking!');
  console.log(`Total Products: ${products.length}`);
  console.log(`Freshly Downloaded: ${downloadedCount}`);
  console.log(`Already Existed: ${alreadyExisted}`);
  console.log(`Fallback Applied: ${fallbackCount}`);
  console.log(`Updated products saved to: ${productsPath}`);
  console.log('================================================================\n');
}

main().catch(err => {
  console.error('Fatal error in downloader:', err);
  process.exit(1);
});
