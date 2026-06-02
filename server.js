const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 5500;
const map = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4'
};

http.createServer((req, res) => {
  let url = req.url.split('?')[0];
  if (url === '/' || url === '') url = '/index.html';
  const filePath = path.join(process.cwd(), url);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': map[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(port, () => console.log('Server running at http://127.0.0.1:' + port));
