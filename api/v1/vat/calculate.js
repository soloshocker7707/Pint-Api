import { validateApiKey } from '../../../lib/auth.js';
import { calculateVAT, VALID_EMIRATES } from '../../../lib/vat.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!validateApiKey(req)) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  try {
    const { items, emirate } = req.body;

    if (!emirate || !VALID_EMIRATES.includes(emirate.toUpperCase())) {
      return res.status(400).json({ 
        error: `Invalid or missing emirate code. Must be one of: ${VALID_EMIRATES.join(', ')}` 
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "items must be a non-empty array" });
    }

    const { subtotal, totalVatAmount, total, lineItems } = calculateVAT(items);

    res.status(200).json({
      subtotal,
      vat_amount: totalVatAmount,
      total,
      line_items: lineItems,
      emirate: emirate.toUpperCase(),
      currency: 'AED'
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
