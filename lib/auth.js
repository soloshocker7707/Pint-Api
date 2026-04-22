import 'dotenv/config';

export const isLuhnValid = (value) => {
  if (!value || typeof value !== 'string') return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = value.length - 1; i >= 0; i--) {
    let digit = parseInt(value.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return (sum % 10) === 0;
};

export const validateApiKey = (req) => {
  const apiKey = req.headers['x-api-key'] || req.query?.['x-api-key'];
  let rawKeys = process.env.API_KEYS || '';
  
  // Clean up any accidental literal quotes if they were pasted into Vercel
  rawKeys = rawKeys.replace(/['"]+/g, '');
  
  const validKeys = rawKeys.split(',').map(k => k.trim()).filter(k => k.length > 0);

  if (!apiKey || !validKeys.includes(apiKey.trim())) {
    return false;
  }
  return true;
};

export const MOCK_BUSINESSES = {
  "100234567890003": "Pint API Solutions LLC",
  "100987654321006": "Global Tech Corp",
  "100555444333224": "Al-Futtaim Group",
  "100111222333442": "Emirates Group"
};
