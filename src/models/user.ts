import { RequestUserType, ResponseUserType, UserType } from '../types';
import { usersData } from '../data';

export const addUser = (data: ResponseUserType) => {
  const newUser: UserType = {
    ...data,
    index: Date.now(),
  };

  usersData.push(newUser);

  const res: RequestUserType = {
    type: 'reg',
    data: {
      name: newUser.name,
      index: newUser.index,
      error: false,
      errorText: '',
    },
    id: 0,
  };

  return JSON.stringify({ ...res, data: JSON.stringify(res.data) });
};
