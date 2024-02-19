import { availibleRooms } from '../data';
import { BSWebSocket, RequestTypeEnum, RequestUpdateRoomType, RoomType } from '../types';
import { stringifyMessage } from '../utils';

export const updateRoomState = (ws: BSWebSocket) => {
  const newRoom: RoomType = {
    roomId: Date.now(),
    roomUsers: [{ index: +ws.index, name: ws.name }],
  };

  availibleRooms.push(newRoom);

  const req: RequestUpdateRoomType = {
    type: RequestTypeEnum.UpdateRoom,
    data: availibleRooms,
    id: 0,
  };

  return stringifyMessage(req);
};
