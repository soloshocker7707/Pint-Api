# Pint API 🇦🇪

A high-performance Express API for UAE-compliant tax logic and e-invoicing. Designed for seamless integration with ERPs, POS systems, and startups.

## 🚀 Features

- **VAT Calculation**: Dynamic calculation for standard (5%), zero-rated (0%), and exempt (0%) categories.
- **Invoice Generation**: Generates PINT AE (UBL 2.1) compliant XML invoices.
- **Compliance Validation**: Real-time scoring of invoice data against UAE regulations.
- **TRN Verification**: 15-digit Tax Registration Number validation with Luhn checksum and business lookup.
- **Security**: Built-in API Key authentication.

## 🛠 Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express
- **XML Engine**: xmlbuilder2
- **Deployment**: Vercel / Zuplo

## 🚦 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/health` | API Status & Version | No |
| GET | `/v1/trn/verify` | Verify UAE TRN & Business Name | Yes |
| POST | `/v1/vat/calculate` | Calculate VAT for line items | Yes |
| POST | `/v1/invoice/generate` | Generate PINT AE XML | Yes |
| POST | `/v1/invoice/validate` | Validate Invoice Compliance | Yes |

## 📦 Installation

```bash
npm install
npm start
```

## 🔒 Configuration

Create a `.env` file in the root directory:
```env
API_KEYS=your-key-1,your-key-2
PORT=3000
```

---
Built with ❤️ for the UAE developer community.
