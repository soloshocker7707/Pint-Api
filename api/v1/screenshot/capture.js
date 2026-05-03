import { getBrowser, closeBrowser } from '../../../lib/browser.js';
import { validateZuploSecret, setCorsHeaders } from '../../../lib/auth.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Basic authentication check
  if (!validateZuploSecret(req, res)) return;

  const { 
    url, 
    width = 1280, 
    height = 800, 
    fullPage = false, 
    waitFor = 0, 
    format = 'png', 
    quality = 90 
  } = req.body;

  if (!url) {
    return res.status(400).json({ status: 'error', message: 'url is required' });
  }

  let browser = null;
  try {
    browser = await getBrowser();
    const page = await browser.newPage();
    
    await page.setViewport({ 
      width: Number(width), 
      height: Number(height) 
    });

    await page.goto(url, { 
      waitUntil: 'networkidle2', 
      timeout: 30000 
    });

    if (waitFor > 0) {
      await new Promise(resolve => setTimeout(resolve, Number(waitFor)));
    }

    const screenshot = await page.screenshot({
      fullPage: !!fullPage,
      type: format === 'jpeg' ? 'jpeg' : 'png',
      quality: format === 'jpeg' ? Number(quality) : undefined,
      encoding: 'base64'
    });

    if (process.env.DEBUG_PREVIEW === 'true') {
      const buffer = Buffer.from(screenshot, 'base64');
      res.setHeader('Content-Type', format === 'jpeg' ? 'image/jpeg' : 'image/png');
      res.setHeader('Content-Length', buffer.length);
      return res.end(buffer, 'binary');
    }

    return res.status(200).json({
      success: true,
      image_base64: screenshot,
      format,
      width: Number(width),
      height: Number(height),
      url,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Capture error:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  } finally {
    await closeBrowser(browser);
  }
}
