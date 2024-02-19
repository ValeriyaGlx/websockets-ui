import { RequestTypeEnum, RequestUpdateUsersType, RequestUserType, ResponseUserType, UserType } from '../types';
import { usersData, winnersList } from '../data';
import { stringifyMessage } from '../utils';

export const addUser = (data: ResponseUserType) => {
  const newUser: UserType = {
    ...data,
    index: Date.now(),
  };

  usersData.push(newUser);

  const req: RequestUserType = {
    type: RequestTypeEnum.Registration,
    data: {
      name: newUser.name,
      index: newUser.index,
      error: false,
      errorText: '',
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
