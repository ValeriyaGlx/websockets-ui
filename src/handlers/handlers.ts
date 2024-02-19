/* eslint-disable no-unused-vars */
import { addUser, updateRoomState, updateWinners } from '../models';
import { BSWebSocket, ResponseTypeEnum, ResponseUserType, WsRequest, WsResponse } from '../types';

export const handlers: Record<ResponseTypeEnum, (data: WsResponse, ws: BSWebSocket) => void> = {
  [ResponseTypeEnum.Registration]: (data, ws) => {
    ws.send(addUser(data, ws));
    ws.send(updateWinners());
  },

  [ResponseTypeEnum.CreateRoom]: (_, ws) => {
    ws.send(updateRoomState(ws));
  },
  [ResponseTypeEnum.StartGame]: () => {
    throw new Error('Function not implemented.');
  },
  [ResponseTypeEnum.Turn]: () => {
    throw new Error('Function not implemented.');
  },
  [ResponseTypeEnum.Attack]: () => {
    throw new Error('Function not implemented.');
  },
  [ResponseTypeEnum.Finish]: () => {
    throw new Error('Function not implemented.');
  },
  [ResponseTypeEnum.AddUserToRoom]: function (data, ws): void {
    throw new Error('Function not implemented.');
  },
  [ResponseTypeEnum.CreateGame]: function (data: ResponseUserType, ws: BSWebSocket): void {
    throw new Error('Function not implemented.');
  },
};
