export default function handler(req, res) {
  res.status(200).json({ status: 'ok', version: '1.1.0 (Modular)' });
}
