import { WebSocket } from 'ws';
import { RequestTypeEnum, ResponseTypeEnum } from './enums';

export type CurrentGameType = {
  gameId: number;
  users: Array<{ indexPlayer: number; ships: ShipsPositionsType[] }>;
};

export interface BSWebSocket extends WebSocket {
  index: number;
  name: string;
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

export type WsResponse = ResponseUserType | ResponseAddToRoom | ResponseAddShipsType;
export type WsRequest =
  | RequestUserType
  | RequestUpdateUsersType
  | RequestUpdateRoomType
  | RequestCreateGame
  | RequestStartGame
  | RequestTurn;

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
  type: 'small' | 'medium' | 'large' | 'huge';
};

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

export type WinnerType = {
  name: string;
  wins: number;
};

export type RequestUpdateUsersType = {
  type: 'update_winners';
  data: Array<WinnerType>;
  id: 0;
};

export type RoomType = {
  roomId: number;
  roomUsers: Array<{
    name: string;
    index: number;
  }>;
};

export type RequestUpdateRoomType = {
  type: 'update_room';
  data: RoomType[];
  id: 0;
};

export type RequestCreateGame = {
  type: 'create_game';
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
