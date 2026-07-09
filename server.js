const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const port = Number(process.env.PORT) || 4173;

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif'
};

const safeJoin = (base, target) => {
    const targetPath = '.' + path.sep + path.normalize(target).replace(/^([/\\])+/, '');
    const resolvedPath = path.resolve(base, targetPath);

    if (!resolvedPath.startsWith(path.resolve(base))) {
        return null;
    }

    return resolvedPath;
};

const sendFile = (response, filePath) => {
    const extension = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extension] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            response.end('Server error');
            return;
        }

        response.writeHead(200, { 'Content-Type': contentType });
        response.end(content);
    });
};

http.createServer((request, response) => {
    const requestUrl = new URL(request.url, `http://${request.headers.host}`);
    const pathname = requestUrl.pathname === '/' ? '/index.html' : decodeURIComponent(requestUrl.pathname);
    const filePath = safeJoin(rootDir, pathname);

    if (!filePath || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        sendFile(response, path.join(rootDir, 'index.html'));
        return;
    }

    sendFile(response, filePath);
}).listen(port, () => {
    console.log(`Northstar Market is running at http://localhost:${port}`);
});