import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png' };

export function createServer() {
  return http.createServer(async (request, response) => {
    if (request.url.startsWith('/api/')) {
      const proxy = http.request({
        hostname: '127.0.0.1', port: Number(process.env.INFERENCE_PORT || 8000),
        path: request.url, method: request.method,
        headers: { ...request.headers, host: `127.0.0.1:${process.env.INFERENCE_PORT || 8000}` },
        timeout: 120000,
      }, upstream => {
        response.writeHead(upstream.statusCode, upstream.headers);
        upstream.pipe(response);
      });
      proxy.on('error', () => {
        if (!response.headersSent) response.writeHead(503, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ detail: 'Inference server is offline. Run .venv/Scripts/python.exe app.py from the project root.' }));
      });
      proxy.on('timeout', () => proxy.destroy(new Error('Inference timeout')));
      request.on('aborted', () => proxy.destroy());
      request.pipe(proxy);
      return;
    }
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
      const path = resolve(root, relative);
      const allowed = relative === 'index.html' || relative === 'styles.css' || relative.startsWith('src/') || relative.startsWith('assets/');
      if (!allowed || !path.startsWith(root + sep) || !types[extname(path)]) {
        response.writeHead(404).end('Not found');
        return;
      }
      const body = await readFile(path);
      response.writeHead(200, {
        'Content-Type': `${types[extname(path)]}; charset=utf-8`,
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer',
        'Permissions-Policy': 'camera=(self), microphone=()',
      });
      response.end(request.method === 'HEAD' ? undefined : body);
    } catch (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 400).end('Unable to serve this file');
    }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  createServer().listen(port, '127.0.0.1', () => {
    console.log(`BIRDS EYE workspace: http://localhost:${port}`);
    console.log('Model API forwarded to the local inference server on port 8000.');
  });
}
