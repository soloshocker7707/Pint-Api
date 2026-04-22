import { validateApiKey } from '../../../lib/auth.js';
import { calculateVAT } from '../../../lib/vat.js';
import { buildPintInvoice } from '../../../lib/xml.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!validateApiKey(req)) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  try {
    const { seller, buyer, items, invoice_number, date } = req.body;

    if (!seller || !buyer || !items || !invoice_number || !date) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { subtotal, totalVatAmount, total, lineItems } = calculateVAT(items);

    const xml = buildPintInvoice({
      seller,
      buyer,
      items: lineItems,
      summary: { subtotal, totalVatAmount, total },
      invoice_number,
      date
    });

    res.status(200).json({
      xml,
      invoice_id: invoice_number,
      total_with_vat: total
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
