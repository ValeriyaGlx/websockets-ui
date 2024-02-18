import { ResponseTypeEnum } from './enums';

export type UserType = {
  name: string;
  password: string;
  index: number;
};

export type NewUserType = Omit<UserType, 'index'>;

export type InputType = {
  type: ResponseTypeEnum;
  data: unknown;
  id: 0;
  [key: string]: unknown;
};
