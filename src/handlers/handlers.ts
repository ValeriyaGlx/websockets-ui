import { ResponseTypeEnum } from '../types';

export const handlers: Record<ResponseTypeEnum, () => void> = {
  [ResponseTypeEnum.Registration]: () => {
    console.log('work registration');
  },
  [ResponseTypeEnum.CreateGame]: function (): void {
    throw new Error('Function not implemented.');
  },
  [ResponseTypeEnum.StartGame]: function (): void {
    throw new Error('Function not implemented.');
  },
  [ResponseTypeEnum.Turn]: function (): void {
    throw new Error('Function not implemented.');
  },
  [ResponseTypeEnum.Attack]: function (): void {
    throw new Error('Function not implemented.');
  },
  [ResponseTypeEnum.Finish]: function (): void {
    throw new Error('Function not implemented.');
  },
};
