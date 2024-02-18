/* eslint-disable no-unused-vars */
import { addUser } from '../models';
import { ResponseTypeEnum, WsRequest, WsResponse } from '../types';

export const handlers: Record<ResponseTypeEnum, (data: WsResponse) => string> = {
  [ResponseTypeEnum.Registration]: (data) => {
    return addUser(data);
  },
  [ResponseTypeEnum.CreateGame]: function (): string {
    throw new Error('Function not implemented.');
  },
  [ResponseTypeEnum.StartGame]: function (): string {
    throw new Error('Function not implemented.');
  },
  [ResponseTypeEnum.Turn]: function (): string {
    throw new Error('Function not implemented.');
  },
  [ResponseTypeEnum.Attack]: function (): string {
    throw new Error('Function not implemented.');
  },
  [ResponseTypeEnum.Finish]: function (): string {
    throw new Error('Function not implemented.');
  },
};
