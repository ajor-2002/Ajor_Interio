const http = require('http');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const rootDir = __dirname;
const port = Number(process.env.PORT || 3000);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const isValidCity = (value) => /^[A-Za-z][A-Za-z\s.'-]{1,}$/.test(String(value).trim());
const getDigitCount = (value) => (String(value).match(/\d/g) || []).length;

const readRequestBody = (req) =>
  new Promise((resolve, reject) => {
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

const sendJson = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
};

const sendFile = (res, filePath) => {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      sendHtml(res, 404, '<h1>404 Not Found</h1>');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
    });
    res.end(content);
  });
};

const sendHtml = (res, statusCode, html) => {
  res.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`<!doctype html><html><head><meta charset="utf-8"><title>AJOR Interio</title></head><body>${html}</body></html>`);
};

const createTransporter = () => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
};

const handleLeadSubmit = async (req, res) => {
  try {
    const body = await readRequestBody(req);
    const name = String(body.name || '').trim();
    const phone = String(body.phone || '').trim();
    const city = String(body.city || '').trim();
    const pageUrl = String(body.pageUrl || '').trim();

    if (!name) {
      sendJson(res, 400, { success: false, message: 'Name is required.' });
      return;
    }

    if (getDigitCount(phone) < 10) {
      sendJson(res, 400, { success: false, message: 'Phone number must contain at least 10 digits.' });
      return;
    }

    if (!isValidCity(city)) {
      sendJson(res, 400, { success: false, message: 'Please enter a valid city name.' });
      return;
    }

    const transporter = createTransporter();
    const mailTo = process.env.MAIL_TO || 'ajorinterio@gmail.com';
    const mailFrom = process.env.MAIL_FROM || process.env.SMTP_USER;

    if (!transporter || !mailFrom) {
      sendJson(res, 500, {
        success: false,
        message:
          'Email service is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and MAIL_FROM.',
      });
      return;
    }

    const submittedAt = new Date().toISOString();
    const subject = `New 3D Design Session Lead - ${name}`;
    const text = [
      'New lead from AJOR Interio website',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `City: ${city}`,
      `Page URL: ${pageUrl || 'N/A'}`,
      `Submitted At: ${submittedAt}`,
    ].join('\n');

    const html = `
      <h2>New lead from AJOR Interio website</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>City:</strong> ${escapeHtml(city)}</p>
      <p><strong>Page URL:</strong> ${escapeHtml(pageUrl || 'N/A')}</p>
      <p><strong>Submitted At:</strong> ${escapeHtml(submittedAt)}</p>
    `;

    await transporter.sendMail({
      from: mailFrom,
      to: mailTo,
      subject,
      text,
      html,
    });

    sendJson(res, 200, { success: true, message: 'Lead emailed successfully.' });
  } catch (error) {
    sendJson(res, 500, {
      success: false,
      message: error.message || 'Failed to send lead email.',
    });
  }
};

http
  .createServer(async (req, res) => {
    if (req.url === '/api/lead' && req.method === 'POST') {
      await handleLeadSubmit(req, res);
      return;
    }

    if (req.url === '/api/lead' && req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      res.end();
      return;
    }

    const safeUrl = decodeURIComponent((req.url || '/').split('?')[0]);
    const normalizedPath = path
      .normalize(safeUrl)
      .replace(/^(\.\.(\/|\\|$))+/, '')
      .replace(/^[/\\]+/, '');

    let filePath = path.join(rootDir, normalizedPath || 'index.html');

    try {
      const stat = fs.existsSync(filePath) ? fs.statSync(filePath) : null;

      if (stat && stat.isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      } else if (!stat && !path.extname(filePath)) {
        filePath = path.join(rootDir, 'index.html');
      }
    } catch (error) {
      filePath = path.join(rootDir, 'index.html');
    }

    if (!fs.existsSync(filePath)) {
      sendHtml(res, 404, '<h1>404 Not Found</h1>');
      return;
    }

    sendFile(res, filePath);
  })
  .listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running at http://localhost:${port}`);
  });
