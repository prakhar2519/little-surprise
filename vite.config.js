import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function surpriseApiPlugin() {
  const dataFilePath = path.resolve(__dirname, 'data/surprises.json');
  const uploadDirPath = path.resolve(__dirname, 'public/uploads');

  const getSurprises = () => {
    try {
      if (fs.existsSync(dataFilePath)) {
        return JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
      }
    } catch (e) {
      console.error('Error reading surprises.json', e);
    }
    return {};
  };

  const saveSurprises = (data) => {
    try {
      fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error writing surprises.json', e);
    }
  };

  return {
    name: 'surprise-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Handle /api/tunnel
        if (req.url === '/api/tunnel') {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.statusCode = 200;
          res.end(JSON.stringify({ publicUrl: 'https://garcia-tuner-inclusion-socks.trycloudflare.com' }));
          return;
        }

        // Handle /api/surprises (POST to save, GET to fetch)
        if (req.url?.startsWith('/api/surprises')) {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.end();
            return;
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const parsed = JSON.parse(body);
                const shortId = Math.random().toString(36).substring(2, 8);
                const surprises = getSurprises();
                surprises[shortId] = {
                  ...parsed,
                  id: shortId,
                  createdAt: new Date().toISOString()
                };
                saveSurprises(surprises);
                res.statusCode = 200;
                res.end(JSON.stringify({ success: true, id: shortId }));
              } catch (err) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
              }
            });
            return;
          }

          if (req.method === 'GET') {
            const parts = req.url.split('/');
            const id = parts[parts.length - 1]?.split('?')[0];
            const surprises = getSurprises();
            if (id && surprises[id]) {
              res.statusCode = 200;
              res.end(JSON.stringify(surprises[id]));
            } else {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Surprise not found' }));
            }
            return;
          }
        }

        // Handle /api/upload for uploading photos
        if (req.url === '/api/upload' && req.method === 'POST') {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');

          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body);
              const dataString = payload.fileBase64 || payload.audioBase64 || payload.imageBase64;
              if (!dataString) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'No media provided' }));
                return;
              }

              // Check if audio or image
              let ext = 'jpg';
              let prefix = 'photo';
              let base64Data = dataString;

              const match = dataString.match(/^data:(image|audio)\/([a-zA-Z0-9_\-\+]+);base64,(.+)$/);
              if (match) {
                const type = match[1];
                let sub = match[2].toLowerCase();
                if (sub === 'jpeg') sub = 'jpg';
                if (sub === 'mpeg' || sub === 'mp3') sub = 'mp3';
                if (sub === 'wav') sub = 'wav';
                if (sub === 'ogg') sub = 'ogg';
                if (sub === 'm4a' || sub === 'mp4' || sub === 'x-m4a') sub = 'm4a';
                ext = sub;
                prefix = type === 'audio' ? 'audio' : 'photo';
                base64Data = match[3];
              }

              const filename = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}.${ext}`;
              const filePath = path.join(uploadDirPath, filename);
              fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, url: `/uploads/${filename}` }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Failed to save media file' }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), surpriseApiPlugin()],
  base: './',
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
  },
});
