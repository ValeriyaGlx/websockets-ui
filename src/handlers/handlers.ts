/* eslint-disable no-unused-vars */
import { availibleRooms, currentGames, usersData } from '../data';
import { eventEmitter, wss } from '../http_server';
import {
  addShips,
  addUser,
  addUserToRoom,
  bothUsersInRoom,
  createRoom,
  getAttack,
  getRandomAttack,
  removeFullRoom,
  switchTurn,
  updateRoomState,
  updateWinners,
} from '../models';
import {
  AttackType,
  BSWebSocket,
  EmiterCommandsEnum,
  RandomAttackType,
  ResponseAddShipsType,
  ResponseAddToRoom,
  ResponseTypeEnum,
  ResponseUserType,
} from '../types';
import { Bot } from '../utils';

export const bot = new Bot();

export const handlers: Record<ResponseTypeEnum, (data: any, ws: BSWebSocket) => void> = {
  [ResponseTypeEnum.Registration]: (data: ResponseUserType, ws) => {
    ws.send(addUser(data, ws));
    ws.send(updateRoomState());
    ws.send(updateWinners());
  },

  [ResponseTypeEnum.CreateRoom]: (_, ws) => {
    createRoom(ws);
    wss.clients.forEach((client) => {
      client.send(updateRoomState());
    });
  },
  [ResponseTypeEnum.AddUserToRoom]: (data: ResponseAddToRoom, ws) => {
    const roomIndex = availibleRooms.findIndex((room) => room.roomId === data.indexRoom);
    wss.clients.forEach((client) => {
      const foundUser = availibleRooms[roomIndex].roomUsers.find(
        (user) => (client as BSWebSocket).index === user.index,
      );
      if (foundUser) {
        client.send(addUserToRoom(data.indexRoom, client as BSWebSocket));
        ws.send(addUserToRoom(data.indexRoom, ws));
      }
    });
    removeFullRoom(data.indexRoom);
    wss.clients.forEach((client) => {
      client.send(updateRoomState());
    });
  },
  [ResponseTypeEnum.AddShips]: (data: ResponseAddShipsType, ws: BSWebSocket) => {
    const gameIndex = currentGames.findIndex((game) => game.gameId === data.gameId);
    
    bothUsersInRoom(data, ws);

    if (currentGames[gameIndex].users.length === 2) {
      wss.clients.forEach((client) => {
        const foundUser = currentGames[gameIndex].users.find(
          (user) => (client as BSWebSocket).index === user.indexPlayer,
        );
        if (foundUser) {
          client.send(addShips(client as BSWebSocket));
          client.send(switchTurn(currentGames[gameIndex]));
        }
      });
    }
  },
  [ResponseTypeEnum.Attack]: (data: AttackType, ws: BSWebSocket) => {
    const gameIndex = currentGames.findIndex((game) => game.gameId === data.gameId);

    if (currentGames[gameIndex].singlePlay) {
      console.log('attack bot ships');
      
    }

    const attack = getAttack(data);

    wss.clients.forEach((client) => {
      const foundUser = currentGames[gameIndex].users.find(
        (user) => (client as BSWebSocket).index === user.indexPlayer,
      );

      if (attack) {
        const { req, turn } = attack;

        if (foundUser) {
          if (Array.isArray(req)) {
            req.forEach((cell) => client.send(cell));
          } else {
            client.send(req);
          }
          client.send(turn);
        }
      }
    });
  },
  [ResponseTypeEnum.RandomAttack]: (data: RandomAttackType, ws: BSWebSocket) => {
    const gameIndex = currentGames.findIndex((game) => game.gameId === data.gameId);

    if (currentGames[gameIndex].singlePlay) {
      console.log('random attack bot ships');
      
    }

    const attack = getRandomAttack(data);

    wss.clients.forEach((client) => {
      const foundUser = currentGames[gameIndex].users.find(
        (user) => (client as BSWebSocket).index === user.indexPlayer,
      );

      if (attack) {
        const { req, turn } = attack;
        if (foundUser) {
          if (Array.isArray(req)) {
            req.forEach((cell) => client.send(cell));
          } else {
            client.send(req);
          }
          client.send(turn);
        }
      }
    });
  },
  [ResponseTypeEnum.SinglePlay]: function (_, ws: BSWebSocket): void {
    eventEmitter.emit(EmiterCommandsEnum.SingleGame);

    const botData = bot.getBotData();
  
    usersData.push(botData);
    createRoom(ws);
    const botRoomIndex = availibleRooms.findIndex((room) => room.roomUsers[0].index === ws.index);
    availibleRooms[botRoomIndex].singlePlay = true;
    const game = addUserToRoom(availibleRooms[botRoomIndex].roomId, ws);
    ws.send(game);
    removeFullRoom(availibleRooms[botRoomIndex].roomId);

   
    // TODO need add bot ships firstly and then bothUsersInRoom;   
  },
};

