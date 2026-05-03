# Pint Screenshot API 📸

A high-performance API for web screenshots, PDF generation, and Open Graph images. Built with Puppeteer and Chromium, optimized for serverless environments.

## 🚀 Features

- **Web Screenshots**: Capture any URL as PNG or JPEG.
- **PDF Generation**: High-fidelity PDF conversion with customizable formats.
- **Open Graph Images**: Specialized endpoint for social media preview images (1200x630).
- **Headless Edge**: Scalable browser logic powered by `puppeteer-core` and `@sparticuz/chromium`.
- **Security**: Built-in API Key and Zuplo secret verification.

## 🛠 Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Vercel Serverless Functions
- **Browser**: Puppeteer-core + Chromium
- **Deployment**: Vercel

## 🚦 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/health` | API Status & Version | No |
| POST | `/v1/screenshot/capture` | Capture PNG/JPEG screenshot | Yes |
| POST | `/v1/screenshot/pdf` | Generate PDF from URL | Yes |
| POST | `/v1/screenshot/og` | Capture 1200x630 OG image | Yes |

## 📦 Local Development

```bash
npm install
# Ensure you have a local Chrome instance or set IS_LOCAL=true
npm start
```

## 🔒 Configuration

Create a `.env` file in the root directory:
```env
API_KEYS=your-key-1,your-key-2
SECRET_ZUPLO=your-internal-secret
ZUPLO_SECRET=your-internal-secret
DEBUG_PREVIEW=false
NODE_ENV=development
```

## 🎫 Tiered Access

The API supports two access tiers via headers:
- **Paid Tier**: Pass `x-zuplo-secret` matching `SECRET_ZUPLO`.
- **Free Tier**: Pass `x-free-tier: true` (Limited to 100 calls/month via Zuplo).

---
Built with ❤️ for rapid web utility development.
