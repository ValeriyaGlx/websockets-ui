/* eslint-disable no-unused-vars */
import { wss } from '../http_server';
import { addUser, addUserToRoom, createRoom, removeFullRoom, updateRoomState, updateWinners } from '../models';
import { BSWebSocket, ResponseAddToRoom, ResponseTypeEnum, ResponseUserType, WsRequest, WsResponse } from '../types';

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
  [ResponseTypeEnum.AddShips]: (data, ws: BSWebSocket) => {
    const gamersFields = [];
    gamersFields.push(ws);
    console.log(gamersFields);

    // const ships = data.ships;
    if (gamersFields.length === 2) {
      console.log('start game');
    }
  },
  [ResponseTypeEnum.StartGame]: () => {
    console.log('');
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
