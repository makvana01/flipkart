async function testCleanQuery(title) {
  const clean = title.replace(/\(.*?\)/g, '').replace(/\b\d+\s*GB\b/gi, '').replace(/\b5G\b/gi, '').trim();
  console.log(`Original: "${title}" -> Clean: "${clean}"`);

  // DDG with clean query
  try {
    const initUrl = `https://duckduckgo.com/?q=${encodeURIComponent(clean)}`;
    const initRes = await fetch(initUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const html = await initRes.text();
    const match = html.match(/vqd=([0-9-]+)/) || html.match(/vqd="([0-9-]+)"/) || html.match(/vqd=([a-zA-Z0-9_-]+)/);
    if (match) {
      const vqd = match[1];
      const imgApiUrl = `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(clean)}&vqd=${vqd}&f=,,,`;
      const res = await fetch(imgApiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://duckduckgo.com/'
        }
      });
      if (res.ok) {
        const data = await res.json();
        console.log(`Results for "${clean}":`, data.results?.length);
        if (data.results && data.results.length > 0) {
          console.log(`  Top URL:`, data.results[0].image);
        }
      }
    }
  } catch (err) {
    console.error(err.message);
  }
}

testCleanQuery('Samsung Galaxy Z Fold 6 5G (Silver Shadow, 256 GB)');
testCleanQuery('OnePlus 12 5G (Silky Black, 256 GB)');
