/* eslint-disable no-unused-vars */
import { wss } from '../http_server';
import {
  addShips,
  addUser,
  addUserToRoom,
  createRoom,
  removeFullRoom,
  updateRoomState,
  updateWinners,
} from '../models';
import {
  BSWebSocket,
  ResponseAddShipsType,
  ResponseAddToRoom,
  ResponseTypeEnum,
  ResponseUserType,
  WsRequest,
  WsResponse,
} from '../types';

export const handlers: Record<ResponseTypeEnum, (data: any, ws: BSWebSocket) => void> = {
  [ResponseTypeEnum.Registration]: (data: ResponseUserType, ws) => {
    ws.send(addUser(data, ws));
    ws.send(updateRoomState());
    ws.send(updateWinners());
  },

  [ResponseTypeEnum.CreateRoom]: (_, ws) => {
    createRoom(ws);
    wss.clients.forEach((client) => {
      client.send(updateRoomState());
    });
  },
  [ResponseTypeEnum.AddUserToRoom]: (data: ResponseAddToRoom, _) => {
    // TODO: update room for each
    //create it not for each only for players
    wss.clients.forEach((client) => {
      client.send(addUserToRoom(data.indexRoom, client as BSWebSocket));
    });
    removeFullRoom(data.indexRoom);
  },
  [ResponseTypeEnum.AddShips]: (data: ResponseAddShipsType, ws: BSWebSocket) => {
    // TODO: update room for each
    //create it not for each only for players
    wss.clients.forEach((client) => {
      client.send(addShips(data, ws));
    });
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
