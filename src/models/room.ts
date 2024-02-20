import { availibleRooms } from '../data';
import { BSWebSocket, RequestCreateGame, RequestTypeEnum, RequestUpdateRoomType, RoomType } from '../types';
import { stringifyMessage } from '../utils';

export const createRoom = (ws: BSWebSocket) => {
  const newRoom: RoomType = {
    roomId: Date.now(),
    roomUsers: [{ index: +ws.index, name: ws.name }],
  };

  availibleRooms.push(newRoom);
};

export const updateRoomState = () => {
  const req: RequestUpdateRoomType = {
    type: RequestTypeEnum.UpdateRoom,
    data: availibleRooms,
    id: 0,
  };

  return stringifyMessage(req);
};

export const addUserToRoom = (index: number, ws: BSWebSocket) => {
  const room = availibleRooms.findIndex((room) => room.roomId === index);
  if (index !== -1) {
    availibleRooms.splice(room, 1);
  }

  console.log(room);
  const req: RequestCreateGame = {
    type: RequestTypeEnum.CreateGame,
    data: {
      idGame: Date.now(),
      idPlayer: +ws.index,
    },
    id: 0,
  };

  return stringifyMessage(req);
};
