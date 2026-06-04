const nodemailer = require('nodemailer');

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const readJsonBody = async (req) => {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }

  return new Promise((resolve, reject) => {
    let raw = '';

    req.on('data', (chunk) => {
      raw += chunk;
    });

    req.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });

    req.on('error', reject);
  });
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed.' });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const name = String(body.name || '').trim();
    const phone = String(body.phone || '').trim();
    const city = String(body.city || '').trim();
    const pageUrl = String(body.pageUrl || '').trim();

    const digitCount = (phone.match(/\d/g) || []).length;
    const isValidCity = /^[A-Za-z][A-Za-z\s.'-]{1,}$/.test(city);

    if (!name) {
      res.status(400).json({ success: false, message: 'Name is required.' });
      return;
    }

    if (digitCount < 10) {
      res.status(400).json({ success: false, message: 'Phone number must contain at least 10 digits.' });
      return;
    }

    if (!isValidCity) {
      res.status(400).json({ success: false, message: 'Please enter a valid city name.' });
      return;
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const mailFrom = process.env.MAIL_FROM || smtpUser;
    const mailTo = process.env.MAIL_TO || 'ajorinterio@gmail.com';

    if (!smtpHost || !smtpUser || !smtpPass || !mailFrom) {
      res.status(500).json({
        success: false,
        message:
          'Email service is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and MAIL_FROM.',
      });
      return;
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const subject = `New 3D Design Session Lead - ${name}`;
    const text = [
      'New lead from AJOR Interio website',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `City: ${city}`,
      `Page URL: ${pageUrl || 'N/A'}`,
      `Submitted At: ${new Date().toISOString()}`,
    ].join('\n');

    const html = `
      <h2>New lead from AJOR Interio website</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>City:</strong> ${escapeHtml(city)}</p>
      <p><strong>Page URL:</strong> ${escapeHtml(pageUrl || 'N/A')}</p>
      <p><strong>Submitted At:</strong> ${escapeHtml(new Date().toISOString())}</p>
    `;

    await transporter.sendMail({
      from: mailFrom,
      to: mailTo,
      subject,
      text,
      html,
    });

    res.status(200).json({ success: true, message: 'Lead emailed successfully.' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send lead email.',
    });
  }
};
