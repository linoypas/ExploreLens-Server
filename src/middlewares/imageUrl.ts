const puppeteer = require('puppeteer');

export async function getImageUrl(siteName: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const siteUrl = `https://www.google.com/search?q=${siteName}&tbm=isch`; 

  await page.goto(siteUrl, { waitUntil: 'domcontentloaded' });
  
  const imageUrls = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img'));
    return images.map(img => img.src);
  });

  await browser.close();
  
  return imageUrls[0] || null;
}
