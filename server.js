const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  try {
    let reqUrl = decodeURIComponent(req.url.split('?')[0]);
    if (reqUrl === '/' || reqUrl === '') reqUrl = '/index.html';
    const filePath = path.join(__dirname, reqUrl);

    // Prevent directory traversal
    if (!filePath.startsWith(__dirname)) {
      res.writeHead(403);
      return res.end('Forbidden');
    }

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not Found: ' + reqUrl);
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';
    const stat = fs.statSync(filePath);

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stat.size,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    });

    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    res.writeHead(500);
    res.end('Server error: ' + err.message);
  }
});

server.listen(PORT, () => {
  console.log(`Portfolio server is running at: http://localhost:${PORT}`);
});
