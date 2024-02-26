import { InputType } from '../types';

export const parseMessage = (message: string): InputType => {
  let parsedMessage;
  try {
    parsedMessage = JSON.parse(message);
  } catch (error) {
    console.error(error);
  }

  const req = {
    ...parsedMessage,
    data: parsedMessage.data ? JSON.parse(parsedMessage.data) : '',
  };

  return req;
};
