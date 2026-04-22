import { validateApiKey, isLuhnValid } from '../../../lib/auth.js';
import { VAT_RATES } from '../../../lib/vat.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!validateApiKey(req)) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  const { seller, buyer, items, invoice_number, date } = req.body;
  const errors = [];
  const passed_checks = [];
  let score = 100;

  // Validation logic (ported from index.js)
  const requiredFields = {
    'seller.name': seller?.name,
    'seller.trn': seller?.trn,
    'seller.address': seller?.address,
    'seller.emirate': seller?.emirate,
    'buyer.name': buyer?.name,
    'buyer.trn': buyer?.trn,
    'buyer.address': buyer?.address,
    'items': Array.isArray(items) && items.length > 0,
    'invoice_number': invoice_number,
    'date': date
  };

  Object.entries(requiredFields).forEach(([field, value]) => {
    if (!value) {
      errors.push({ field, message: `Field '${field}' is required.`, severity: 'error' });
      score -= 10;
    }
  });

  const validateTRN = (trn, label) => {
    if (!trn) return;
    if (trn.length !== 15 || !/^\d+$/.test(trn)) {
      errors.push({ field: `${label}.trn`, message: "TRN must be exactly 15 numeric digits.", severity: 'error' });
      score -= 15;
    } else if (!isLuhnValid(trn)) {
      errors.push({ field: `${label}.trn`, message: "TRN checksum verification failed.", severity: 'warning' });
      score -= 5;
    }
  };

  validateTRN(seller?.trn, 'seller');
  validateTRN(buyer?.trn, 'buyer');

  if (date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date) || isNaN(Date.parse(date))) {
      errors.push({ field: 'date', message: "Date must be in ISO 8601 format (YYYY-MM-DD).", severity: 'error' });
      score -= 10;
    }
  }

  if (Array.isArray(items)) {
    items.forEach((item, idx) => {
      const prefix = `items[${idx}]`;
      if (!VAT_RATES.hasOwnProperty(item.vat_category?.toLowerCase() || item.category?.toLowerCase())) {
        errors.push({ field: `${prefix}.vat_category`, message: "Invalid VAT category.", severity: 'error' });
        score -= 5;
      }
    });
  }

  res.status(200).json({
    valid: !errors.some(e => e.severity === 'error'),
    score: Math.max(0, score),
    errors,
    passed_checks
  });
}
