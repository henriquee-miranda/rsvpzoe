const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Normalizar URL e definir o caminho do arquivo
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }

  // Verificar se config.js foi solicitado, mas não existe
  if (filePath === './config.js' && !fs.existsSync(filePath)) {
    // Redirecionar para config.js.example
    console.log('config.js não encontrado. Use config.js.example como modelo.');
    res.writeHead(200, { 'Content-Type': 'text/javascript' });
    res.end('console.error("config.js não encontrado. Crie o arquivo a partir de config.js.example");\n');
    return;
  }

  // Obter a extensão do arquivo
  const extname = path.extname(filePath);
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  // Ler arquivo
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // Arquivo não encontrado
        fs.readFile('./404.html', (err, content) => {
          if (err) {
            // Se 404.html não existe
            res.writeHead(404);
            res.end('404 - Arquivo não encontrado');
          } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          }
        });
      } else {
        // Outro erro de servidor
        res.writeHead(500);
        res.end(`Erro do servidor: ${error.code}`);
      }
    } else {
      // Sucesso
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log('Para parar o servidor, pressione Ctrl+C');
}); 