import { WsRequest } from '../types';

export const stringifyMessage = (data: WsRequest): string => {
  return JSON.stringify({ ...data, data: JSON.stringify(data.data) });
};
