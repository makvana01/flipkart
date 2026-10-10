async function testDdgImages(query) {
  try {
    const initUrl = 'https://duckduckgo.com/?q=' + encodeURIComponent(query);
    const initRes = await fetch(initUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
    });
    const html = await initRes.text();
    const match = html.match(/vqd=([0-9-]+)/) || html.match(/vqd="([0-9-]+)"/) || html.match(/vqd=([a-zA-Z0-9_-]+)/);
    console.log('Match found:', match ? match[1] : 'null');
    if (!match) return;
    const vqd = match[1];
    const imgUrl = `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,`;
    const res = await fetch(imgUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://duckduckgo.com/'
      }
    });
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Results:', data.results?.length);
    if (data.results && data.results.length > 0) {
      const best = data.results.find(r => r.image && (r.image.includes('flixcart.com') || r.image.includes('apple.com') || r.image.includes('amazon') || r.image.includes('gsmarena'))) || data.results[0];
      console.log('Selected image URL:', best.image);
      const imgRes = await fetch(best.image, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      });
      console.log('Download status:', imgRes.status);
      const fs = await import('fs');
      const buf = Buffer.from(await imgRes.arrayBuffer());
      fs.writeFileSync('public/assets/images/products/mob_01.jpg', buf);
      console.log('Saved mob_01.jpg, size:', buf.length);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testDdgImages('iPhone 16 Pro Max');
