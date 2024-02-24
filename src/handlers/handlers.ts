/* eslint-disable no-unused-vars */
import { availibleRooms, currentGames } from '../data';
import { wss } from '../http_server';
import {
  addShips,
  addUser,
  addUserToRoom,
  checkTurn,
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
  RandomAttackType,
  ResponseAddShipsType,
  ResponseAddToRoom,
  ResponseTypeEnum,
  ResponseUserType,
} from '../types';

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

    const gameData = addShips(data, ws);

    if (currentGames[gameIndex].users.length === 2) {
      // TODO Cannot read properties of undefined (reading 'forEach')
      wss.clients.forEach((client) => {
        const foundUser = currentGames[gameIndex].users.find(
          (user) => (client as BSWebSocket).index === user.indexPlayer,
        );
        if (foundUser) {
          client.send(gameData);
          client.send(switchTurn(currentGames[gameIndex]));
        }
      });
    }
  },
  [ResponseTypeEnum.Attack]: (data: AttackType) => {
    const gameIndex = currentGames.findIndex((game) => game.gameId === data.gameId);
    const attack = getAttack(data);

    wss.clients.forEach((client) => {
      const foundUser = currentGames[gameIndex].users.find(
        (user) => (client as BSWebSocket).index === user.indexPlayer,
      );

      // TODO: запретить ходить не в свой ход
      // console.log(foundUser?.indexPlayer);
      // console.log(checkTurn(currentGames[gameIndex]));

      if (foundUser) {
        const { req, turn } = attack;
        if (Array.isArray(req)) {
          req.forEach((cell) => client.send(cell));
        } else {
          client.send(req);
        }
        client.send(turn);
      }
    });
  },
  [ResponseTypeEnum.RandomAttack]: (data: RandomAttackType) => {
    const gameIndex = currentGames.findIndex((game) => game.gameId === data.gameId);
    const attack = getRandomAttack(data);

    wss.clients.forEach((client) => {
      const foundUser = currentGames[gameIndex].users.find(
        (user) => (client as BSWebSocket).index === user.indexPlayer,
      );

      // TODO: запретить ходить не в свой ход
      // console.log(foundUser?.indexPlayer);
      // console.log(checkTurn(currentGames[gameIndex]));

      if (foundUser) {
        const { req, turn } = attack;
        if (Array.isArray(req)) {
          req.forEach((cell) => client.send(cell));
        } else {
          client.send(req);
        }
        client.send(turn);
      }
    });
  },
};
