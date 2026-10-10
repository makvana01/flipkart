import fs from 'fs';

async function searchReviewImages(title) {
  const queries = [
    `${title} flipkart customer review photo`,
    `${title} buyer unboxing review photo`,
    `${title} customer review in hand photo`
  ];
  
  for (const q of queries) {
    const url = `https://www.bing.com/images/search?q=${encodeURIComponent(q)}&form=HDRSC2&first=1`;
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
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
      if (matches.length > 0) {
        return { query: q, count: matches.length, samples: matches.slice(0, 3) };
      }
    } catch (e) {}
  }
  return null;
}

async function run() {
  const testItems = [
    'BERSACHE Premium High-Top Trekking Shoes',
    'boAt Rockerz 450 Bluetooth Headphone',
    'Prestige 1.5 Litre Electric Kettle',
    'Minimalist 10% Niacinamide Face Serum'
  ];
  for (const item of testItems) {
    const res = await searchReviewImages(item);
    console.log('Result for:', item);
    console.log(JSON.stringify(res, null, 2));
  }
}
run();
