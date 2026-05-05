import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export async function getBrowser() {
  const isLocal = process.env.NODE_ENV === 'development' || !!process.env.IS_LOCAL;
  
  if (isLocal) {
    return await puppeteer.launch({
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      headless: true,
    });
  }

  // Node 18 + Chromium 119 + Puppeteer 21 is the 'Golden Trio' for Vercel.
  // This combination ensures all system libraries (libnss3, etc) are available.
  return await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
}

export async function closeBrowser(browser) {
  if (browser) {
    await browser.close();
  }
}
