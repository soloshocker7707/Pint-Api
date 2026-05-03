export default function handler(req, res) {
  res.status(200).json({
    status: 'success',
    message: 'You are on the waitlist for Pint Screenshot API.',
    info: 'We will notify you when more capacity is available.'
  });
}
