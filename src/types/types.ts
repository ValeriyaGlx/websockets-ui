import { WebSocket } from 'ws';
import { AttackStatusEnum, RequestTypeEnum, ResponseTypeEnum, ShipTypeEnum } from './enums';
import { GameBoard } from '../utils/createShipsMap';

export type CurrentGameType = {
  gameId: number;
  users: CurrentGameUsersType;
  singlePlay?: boolean;
};

export type CurrentGameUsersType = Array<{ indexPlayer: number; board: GameBoard }>;

export interface BSWebSocket extends WebSocket {
  index: number;
  name: string;
  ships: ShipsPositionsType[];
}

export type UserType = {
  name: string;
  password: string;
  index: number;
};

export type ResponseUserType = Omit<UserType, 'index'>;

export type ResponseAddToRoom = {
  indexRoom: number;
};

export type InputType = {
  type: ResponseTypeEnum;
  data: WsResponse;
  id: 0;
};

export type AttackType = {
  gameId: number;
  x: number;
  y: number;
  indexPlayer: number;
};

export type RandomAttackType = Omit<AttackType, 'x' | 'y'>;

export type ResponseAttackType = {
  type: ResponseTypeEnum.Attack;
  data: AttackType;
  id: 0;
};

export type RequestAttackType = {
  type: RequestTypeEnum.Attack;
  data: {
    position: {
      x: number;
      y: number;
    };
    currentPlayer: number;
    status: AttackStatusEnum;
  };
  id: 0;
};

export type WsResponse = ResponseUserType | ResponseAddToRoom | ResponseAddShipsType | ResponseAttackType | any;
export type WsRequest =
  | RequestUserType
  | RequestUpdateUsersType
  | RequestUpdateRoomType
  | RequestCreateGame
  | RequestStartGame
  | RequestTurn
  | RequestAttackType
  | RequestFinishType;

export type ResponseAddShipsType = {
  gameId: number;
  ships: ShipsPositionsType[];
  indexPlayer: number;
};

export type ShipsPositionsType = {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: ShipTypeEnum;
};

export type RequestUserType = {
  type: RequestTypeEnum.Registration;
  data: {
    name: string;
    index: number;
    error: boolean;
    errorText: string;
  };
  id: 0;
};

export type WinnerType = {
  name: string;
  wins: number;
};

export type RequestUpdateUsersType = {
  type: RequestTypeEnum.UpdateWinners;
  data: Array<WinnerType>;
  id: 0;
};

export type RoomType = {
  roomId: number;
  roomUsers: Array<{
    name: string;
    index: number;
  }>;
  singlePlay?: boolean;
};

export type RequestUpdateRoomType = {
  type: RequestTypeEnum.UpdateRoom;
  data: RoomType[];
  id: 0;
};

export type RequestCreateGame = {
  type: RequestTypeEnum.CreateGame;
  data: {
    idGame: number;
    idPlayer: number;
  };
  id: 0;
};

export type RequestStartGame = {
  type: RequestTypeEnum.StartGame;
  data: {
    ships: ShipsPositionsType[];
    currentPlayerIndex: number;
  };
  id: 0;
};

export type RequestTurn = {
  type: RequestTypeEnum.Turn;
  data: {
    currentPlayer: number;
  };
  id: 0;
};

export type RequestFinishType = {
  type: RequestTypeEnum.Finish;
  data: {
    winPlayer: number | string;
  };
  id: 0;
};
