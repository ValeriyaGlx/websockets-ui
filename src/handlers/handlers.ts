/* eslint-disable no-unused-vars */
import { addUser, updateWinners } from '../models';
import { ResponseTypeEnum, WsRequest, WsResponse } from '../types';

// TODO: change Type
export const handlers: Record<ResponseTypeEnum, (data: WsResponse) => { [key: string]: string }> = {
  [ResponseTypeEnum.Registration]: (data) => {
    return { user: addUser(data), winners: updateWinners() };
  },
  [ResponseTypeEnum.CreateGame]: () => {
    throw new Error('Function not implemented.');
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
};
