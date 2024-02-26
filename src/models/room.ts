import { availibleRooms, currentGames } from '../data';
import { bot } from '../handlers/handlers';
import {
  BSWebSocket,
  CurrentGameType,
  RequestCreateGame,
  RequestStartGame,
  RequestTypeEnum,
  RequestUpdateRoomType,
  ResponseAddShipsType,
  RoomType,
} from '../types';
import { stringifyMessage } from '../utils';
import { GameBoard, Ship } from '../utils/createShipsMap';

export const createRoom = (ws: BSWebSocket) => {
  const isRoomExist = availibleRooms.find((room) => {
    return room.roomUsers[0].index === ws.index;
  });

  if (isRoomExist) return;

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

  availibleRooms[roomIndex].roomUsers.push({ index: +ws.index, name: ws.name });

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
    if (availibleRooms[roomIndex].singlePlay) {
      currentGame.singlePlay = true;
    }

    currentGames.push(currentGame);
    availibleRooms.splice(roomIndex, 1);
  }
};

export const bothUsersInRoom = (data: ResponseAddShipsType, ws: BSWebSocket) => {
  
  const { gameId, ships, indexPlayer } = data;
  const gameIndex = currentGames.findIndex((game) => game.gameId === gameId);

  ws.ships = ships;

  const gameBoard = new GameBoard();

  for (const ship of ships) {
    const newShip = new Ship(ship);
    gameBoard.placeShip(newShip);
  }

  if (gameIndex !== -1 && currentGames[gameIndex].users.length < 2) {
    currentGames[gameIndex].users.push({
      indexPlayer,
      board: gameBoard,
    });
  }

  if (currentGames[gameIndex].singlePlay) {
    const botShips = bot.getBotShipsPosition();

    const gameBoard = new GameBoard();

    for (const ship of botShips.ships) {
      const newShip = new Ship(ship);
      gameBoard.placeShip(newShip);
    }

    currentGames[gameIndex].users.push({
      indexPlayer: botShips.indexPlayer,
      board: gameBoard,
    });
    }
};

export const addShips = (client: BSWebSocket) => {
  const req: RequestStartGame = {
    type: RequestTypeEnum.StartGame,
    data: {
      ships: client.ships,
      currentPlayerIndex: +client.index,
    },
    id: 0,
  };

  return stringifyMessage(req);
};
