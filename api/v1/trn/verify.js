import { validateApiKey, isLuhnValid, MOCK_BUSINESSES } from '../../../lib/auth.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!validateApiKey(req)) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  const { trn } = req.query;

  if (!trn) {
    return res.status(400).json({ valid: false, message: "TRN parameter is required" });
  }

  if (trn.length !== 15 || !/^\d+$/.test(trn)) {
    return res.status(200).json({
      valid: false,
      trn,
      format_check: 'fail',
      message: trn.length !== 15 ? "Invalid length. TRN must be exactly 15 digits." : "Invalid format. TRN must contain only numbers."
    });
  }

  const passesChecksum = isLuhnValid(trn);
  const businessName = MOCK_BUSINESSES[trn];

  if (!passesChecksum) {
    return res.status(200).json({
      valid: false,
      trn,
      format_check: 'pass',
      checksum_check: 'fail',
      message: "Invalid TRN. Checksum verification failed."
    });
  }

  res.status(200).json({
    valid: true,
    trn,
    business_name: businessName || "Format Verified (Official identity not verified)",
    format_check: 'pass',
    checksum_check: 'pass',
    verification_source: businessName ? "Internal Database" : "Algorithmic Format Check",
    message: businessName 
      ? `TRN is valid and verified for ${businessName}.` 
      : "TRN format and checksum are valid."
  });
}
