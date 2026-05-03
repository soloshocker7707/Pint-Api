import { getBrowser, closeBrowser } from '../../../lib/browser.js';
import { validateZuploSecret, setCorsHeaders } from '../../../lib/auth.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Authentication check
  if (!validateZuploSecret(req, res)) return;

  const { 
    url, 
    html,
    format = 'A4', 
    landscape = false, 
    margin = { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
    printBackground = true,
    scale = 1
  } = req.body;

  if (!url && !html) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Either "url" or "html" must be provided.' 
    });
  }

  let browser = null;
  try {
    browser = await getBrowser();
    const page = await browser.newPage();
    
    if (html) {
      await page.setContent(html, { waitUntil: 'networkidle0' });
    } else {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    }

    const pdfBuffer = await page.pdf({
      format,
      landscape: !!landscape,
      printBackground: !!printBackground,
      scale: Number(scale),
      margin: {
        top: margin.top || '1cm',
        right: margin.right || '1cm',
        bottom: margin.bottom || '1cm',
        left: margin.left || '1cm'
      }
    });

    if (process.env.DEBUG_PREVIEW === 'true') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Length', pdfBuffer.length);
      return res.end(pdfBuffer, 'binary');
    }

    return res.status(200).json({
      success: true,
      pdf_base64: pdfBuffer.toString('base64'),
      format,
      landscape: !!landscape,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  } finally {
    await closeBrowser(browser);
  }
}
