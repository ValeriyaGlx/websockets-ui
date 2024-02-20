import { availibleRooms, currentGames } from '../data';
import { BSWebSocket, CurrentGameType, RequestCreateGame, RequestTypeEnum, RequestUpdateRoomType, RoomType } from '../types';
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
  const roomIndex = availibleRooms.findIndex((room) => room.roomId === index);

  const req: RequestCreateGame = {
    type: RequestTypeEnum.CreateGame,
    data: {
      idGame: availibleRooms[roomIndex].roomId,
      idPlayer: +ws.index,
    },
    id: 0,
  };

  return stringifyMessage(req);
};

export const removeFullRoom = (index: number) => {
  const roomIndex = availibleRooms.findIndex((room) => room.roomId === index);
  if (index !== -1) {
    const currentGame: CurrentGameType = { gameId: index, users: [] };
    currentGames.push(currentGame);
    availibleRooms.splice(roomIndex, 1);
  }
};
