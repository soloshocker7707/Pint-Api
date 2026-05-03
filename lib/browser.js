import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export async function getBrowser() {
  const isLocal = process.env.NODE_ENV === 'development' || !!process.env.IS_LOCAL;
  
  const executablePath = isLocal 
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' // Default Mac path
    : await chromium.executablePath();

  const browser = await puppeteer.launch({
    args: isLocal ? [] : [
      ...chromium.args,
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
    defaultViewport: chromium.defaultViewport,
    executablePath,
    headless: isLocal ? true : chromium.headless,
    ignoreHTTPSErrors: true,
  });

  return browser;
}

export async function closeBrowser(browser) {
  if (browser) {
    await browser.close();
  }
}
