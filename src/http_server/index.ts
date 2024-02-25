import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import WebSocket from 'ws';
import { handlers } from '../handlers/handlers';
import { parseMessage } from '../utils/parseMessage';
import { BSWebSocket } from '../types';

export const httpServer = http.createServer((req, res) => {
  const dirname = path.resolve(path.dirname(''));
  const filePath = dirname + (req.url === '/' ? '/front/index.html' : `/front${req.url}`);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});

export const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', (ws: BSWebSocket) => {
  console.log('New client connected');

  ws.on('message', (message: string) => {
    const parsedMessage = parseMessage(message);

    const handler = handlers[parsedMessage.type];
    if (handler) {
      handler(parsedMessage.data, ws);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
