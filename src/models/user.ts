import {
  BSWebSocket,
  RequestTypeEnum,
  RequestUpdateUsersType,
  RequestUserType,
  ResponseUserType,
  UserType,
} from '../types';
import { usersData, winnersList } from '../data';
import { stringifyMessage } from '../utils';

export const addUser = (data: ResponseUserType, ws: BSWebSocket) => {
  const newUser: UserType = {
    ...data,
    index: Date.now(),
  };

  const { index, name } = newUser;
  const isUserNotExist = usersData.every((user) => user.name !== name);

  if (isUserNotExist) {
    usersData.push(newUser);

    ws.index = index;
    ws.name = name;
  }

  const req: RequestUserType = {
    type: RequestTypeEnum.Registration,
    data: {
      name: name,
      index: index,
      error: !isUserNotExist,
      errorText: !isUserNotExist ? 'User with this name is already exist' : '',
    },
    id: 0,
  };

  return stringifyMessage(req);
};

export const updateWinners = () => {
  const req: RequestUpdateUsersType = {
    type: RequestTypeEnum.UpdateWinners,
    data: winnersList,
    id: 0,
  };

  return stringifyMessage(req);
};
