import fs from 'fs';

async function test() {
  const query = 'BERSACHE Premium High-Top Trekking Shoes real customer review photo';
  const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2&first=1`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
  });
  const html = await res.text();
  const regex = /murl&quot;:&quot;(https?:\/\/[^&"]+?\.(?:jpg|jpeg|png|webp))/gi;
  const matches = [];
  let m;
  while ((m = regex.exec(html)) !== null) {
    matches.push(m[1]);
  }
  console.log('Matches found for BERSACHE:', matches.length);
  console.log('Sample matches:', matches.slice(0, 5));

  // Test iPhone 15
  const query2 = 'Apple iPhone 15 Flipkart unboxing customer review photo';
  const url2 = `https://www.bing.com/images/search?q=${encodeURIComponent(query2)}&form=HDRSC2&first=1`;
  const res2 = await fetch(url2, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html2 = await res2.text();
  const matches2 = [];
  while ((m = regex.exec(html2)) !== null) {
    matches2.push(m[1]);
  }
  console.log('Matches found for iPhone 15:', matches2.length);
  console.log('Sample matches 2:', matches2.slice(0, 5));
}

test();
