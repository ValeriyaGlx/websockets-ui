import { ResponseTypeEnum } from './enums';

export type UserType = {
  name: string;
  password: string;
  index: number;
};

export type ResponseUserType = Omit<UserType, 'index'>;

export type InputType = {
  type: ResponseTypeEnum;
  data: WsResponse;
  id: 0;
};

export type WsResponse = ResponseUserType;
export type WsRequest = RequestUserType;

export type RequestUserType = {
  type: 'reg';
  data: {
    name: string;
    index: number;
    error: boolean;
    errorText: string;
  };
  id: 0;
};
