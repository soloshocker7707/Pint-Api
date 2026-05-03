export default function handler(req, res) {
  res.status(403).json({
    status: 'error',
    code: 'ACCESS_BLOCKED',
    message: 'Your access to this API has been restricted.'
  });
}
