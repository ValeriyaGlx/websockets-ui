import fs from 'fs';
import path from 'path';
import http from 'http';
import WebSocket from 'ws';
import { handlers } from '../handlers/handlers';
import { parseMessage } from '../utils/parseMessage';

export const httpServer = http.createServer(function (req, res) {
  const __dirname = path.resolve(path.dirname(''));
  const file_path = __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);
  fs.readFile(file_path, function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});

const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', (ws: WebSocket) => {
  console.log('New client connected');

  ws.on('message', (message: string) => {
    const parsedMessage = parseMessage(message);

    const handler = handlers[parsedMessage.type];
    if (handler) {
      const req = handler(parsedMessage.data);
      console.log(req);
      ws.send(req);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
