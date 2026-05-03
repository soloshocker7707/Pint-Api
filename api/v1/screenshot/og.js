import { getBrowser, closeBrowser } from '../../../lib/browser.js';
import { validateZuploSecret, setCorsHeaders } from '../../../lib/auth.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Authentication check
  if (!validateZuploSecret(req, res)) return;

  const { 
    title, 
    description = '', 
    theme = 'light', 
    background_color, 
    logo_url 
  } = req.body;

  if (!title) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'title is required' 
    });
  }

  // Constraints
  const displayTitle = title.substring(0, 80);
  const displayDescription = description.substring(0, 120);

  // Theme Styles
  const themes = {
    light: { bg: '#ffffff', text: '#1a1a1a', secondary: '#4a4a4a' },
    dark: { bg: '#0F0F1A', text: '#ffffff', secondary: '#a0a0a0' },
    brand: { bg: '#534AB7', text: '#ffffff', secondary: '#e0e0e0' }
  };

  const currentTheme = themes[theme] || themes.light;
  const bgColor = background_color || currentTheme.bg;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
      <style>
        body {
          margin: 0;
          padding: 0;
          width: 1200px;
          height: 630px;
          background-color: ${bgColor};
          color: ${currentTheme.text};
          font-family: 'Inter', sans-serif;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 80px;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
        }

        .logo {
          position: absolute;
          top: 60px;
          left: 80px;
          max-height: 50px;
          max-width: 200px;
          object-fit: contain;
        }

        .content {
          margin-top: 40px;
        }

        h1 {
          font-size: 72px;
          font-weight: 700;
          line-height: 1.1;
          margin: 0;
          letter-spacing: -0.02em;
          max-width: 900px;
        }

        p {
          font-size: 32px;
          line-height: 1.4;
          margin-top: 24px;
          color: ${currentTheme.secondary};
          max-width: 800px;
        }

        /* Subtle design element */
        .accent {
          position: absolute;
          bottom: -50px;
          right: -50px;
          width: 300px;
          height: 300px;
          background: ${currentTheme.text};
          opacity: 0.03;
          border-radius: 50%;
        }
      </style>
    </head>
    <body>
      ${logo_url ? `<img src="${logo_url}" class="logo" />` : ''}
      <div class="content">
        <h1>${displayTitle}</h1>
        ${displayDescription ? `<p>${displayDescription}</p>` : ''}
      </div>
      <div class="accent"></div>
    </body>
    </html>
  `;

  let browser = null;
  try {
    browser = await getBrowser();
    const page = await browser.newPage();
    
    await page.setViewport({ width: 1200, height: 630 });
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const screenshot = await page.screenshot({
      type: 'png',
      encoding: 'base64'
    });

    if (process.env.DEBUG_PREVIEW === 'true') {
      const buffer = Buffer.from(screenshot, 'base64');
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Length', buffer.length);
      return res.end(buffer, 'binary');
    }

    return res.status(200).json({
      success: true,
      image_base64: screenshot,
      width: 1200,
      height: 630,
      theme,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('OG generation error:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  } finally {
    await closeBrowser(browser);
  }
}
