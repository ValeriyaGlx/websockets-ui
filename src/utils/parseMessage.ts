import { InputType } from '../types';

export const parseMessage = (message: string): InputType => {
  let parsedMessage;
  try {
    parsedMessage = JSON.parse(message);
  } catch (error) {
    console.error('Parsed Error', error);
  }
  return { ...parsedMessage, data: parsedMessage.data ? JSON.parse(parsedMessage.data) : '' };
};
