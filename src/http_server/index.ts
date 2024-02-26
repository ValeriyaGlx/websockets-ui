import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import WebSocket from 'ws';
import EventEmitter from 'node:events';

import { handlers } from '../handlers/handlers';
import { parseMessage } from '../utils/parseMessage';
import { BSWebSocket, EmiterCommandsEnum } from '../types';
import { updateWinners } from '../models';

export const eventEmitter = new EventEmitter();

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
    console.log(parsedMessage);

    const handler = handlers[parsedMessage.type];
    if (handler) {
      handler(parsedMessage.data, ws);
    }
  });

  ws.on('close', () => {
    // удалить юзера из базы
    console.log('Client disconnected');
  });

  eventEmitter.on(EmiterCommandsEnum.FinishGame, () => {
    ws.send(updateWinners());
  });
});
