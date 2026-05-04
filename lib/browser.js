import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';

export async function getBrowser() {
  const isLocal = process.env.NODE_ENV === 'development' || !!process.env.IS_LOCAL;
  
  if (isLocal) {
    return await puppeteer.launch({
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      headless: true,
    });
  }

  // Use the self-contained binary pack for Chromium 122
  // This version includes all necessary shared libraries (libnss3, etc)
  return await puppeteer.launch({
    args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath('https://github.com/Sparticuz/chromium/releases/download/v122.0.0/chromium-v122.0.0-pack.tar'),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
}

export async function closeBrowser(browser) {
  if (browser) {
    await browser.close();
  }
}
