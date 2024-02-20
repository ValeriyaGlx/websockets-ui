/* eslint-disable no-unused-vars */
import { availibleRooms } from '../data';
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
import { BSWebSocket, ResponseAddShipsType, ResponseAddToRoom, ResponseTypeEnum, ResponseUserType } from '../types';

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
  [ResponseTypeEnum.AddUserToRoom]: (data: ResponseAddToRoom, ws) => {
    // TODO: take a look why there are 3 response (should be 2);
    const roomIndex = availibleRooms.findIndex((room) => room.roomId === data.indexRoom);
    wss.clients.forEach((client) => {
      const foundUser = availibleRooms[roomIndex].roomUsers.find(
        (user) => (client as BSWebSocket).index === user.index,
      );
      if (foundUser) {
        client.send(addUserToRoom(data.indexRoom, client as BSWebSocket));
        ws.send(addUserToRoom(data.indexRoom, ws));
      }
    });
    removeFullRoom(data.indexRoom);
    wss.clients.forEach((client) => {
      client.send(updateRoomState());
    });
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
