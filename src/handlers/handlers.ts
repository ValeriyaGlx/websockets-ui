/* eslint-disable no-unused-vars */
import { wss } from '../http_server';
import { addUser, addUserToRoom, createRoom, updateRoomState, updateWinners } from '../models';
import { BSWebSocket, ResponseAddToRoom, ResponseTypeEnum, ResponseUserType, WsRequest, WsResponse } from '../types';

export const handlers: Record<ResponseTypeEnum, (data: any, ws: BSWebSocket) => void> = {
  [ResponseTypeEnum.Registration]: (data: ResponseUserType, ws) => {
    ws.send(addUser(data, ws));
    ws.send(updateRoomState());
    ws.send(updateWinners());
  },

  [ResponseTypeEnum.CreateRoom]: (_, ws) => {
    createRoom(ws);
    wss.clients.forEach(function each(client) {
      client.send(updateRoomState());
    });
  },
  [ResponseTypeEnum.AddUserToRoom]: function (data: ResponseAddToRoom, ws): void {
    ws.send(addUserToRoom(data.indexRoom, ws));
  },

  [ResponseTypeEnum.StartGame]: () => {
    return;
  },
  [ResponseTypeEnum.Turn]: () => {
    return;
  },
  [ResponseTypeEnum.Attack]: () => {
    return;
  },
  [ResponseTypeEnum.Finish]: () => {
    return;
  },
};
