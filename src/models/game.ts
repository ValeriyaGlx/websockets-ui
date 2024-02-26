import { currentGames, winnersList } from '../data';
import {
  AttackStatusEnum,
  AttackType,
  BSWebSocket,
  CurrentGameType,
  EmiterCommandsEnum,
  RandomAttackType,
  RequestAttackType,
  RequestFinishType,
  RequestTurn,
  RequestTypeEnum,
} from '../types';
import { stringifyMessage } from '../utils';

import { eventEmitter, wss } from '../http_server';

let index: number = 0;

export const switchTurn = (game: CurrentGameType, command?: AttackStatusEnum) => {
  const { users } = game;
  let turn = users[index].indexPlayer;
  switch (command) {
    case AttackStatusEnum.Killed:
    case AttackStatusEnum.Shot:
      if (index === 0) {
        index = 0;
      } else {
        index = 1;
      }
      turn = users[index].indexPlayer;
      break;
    case AttackStatusEnum.Miss:
      if (index === 0) {
        index = 1;
      } else {
        index = 0;
      }
      turn = users[index].indexPlayer;
      break;
    default:
      turn = users[0].indexPlayer;
      break;
  }

  const req: RequestTurn = {
    type: RequestTypeEnum.Turn,
    data: {
      currentPlayer: turn,
    },
    id: 0,
  };
  return stringifyMessage(req);
};

const checkTurn = (game: CurrentGameType) => {
  const { users } = game;
  return users[index].indexPlayer;
};

const recountWinners = (index: number) => {
  const winner = [...wss.clients].find((client) => {
    return (client as BSWebSocket).index === index;
  });

  const winnerName = (winner as BSWebSocket).name;

  const existWinner = winnersList.find((winner) => winner.name === winnerName);

  if (existWinner) {
    existWinner.wins++;
  } else {
    winnersList.push({ name: winnerName, wins: 1 });
  }

  return winnersList;
};

export const getAttack = (data: AttackType) => {
  const { x, y, gameId, indexPlayer } = data;
  const gameIndex = currentGames.findIndex((game) => game.gameId === gameId);
  const opponentUser = currentGames[gameIndex].users.find((user) => user.indexPlayer !== indexPlayer);
  const attack = opponentUser?.board.attack({ x, y });
  const isFinish = opponentUser?.board.isShipsEnds();

  const currentIndex = checkTurn(currentGames[gameIndex]);

  if (indexPlayer !== currentIndex) return;

  let turn: string;
  if (isFinish) {
    recountWinners(indexPlayer);
    eventEmitter.emit(EmiterCommandsEnum.FinishGame);
    const req: RequestFinishType = {
      type: RequestTypeEnum.Finish,
      data: {
        winPlayer: indexPlayer,
      },
      id: 0,
    };
    turn = stringifyMessage(req);
  } else {
    turn = switchTurn(currentGames[gameIndex], attack?.hit);
  }

  let request: RequestAttackType;

  if (attack?.cells.length === 0) {
    request = {
      type: RequestTypeEnum.Attack,
      data: {
        position: {
          x,
          y,
        },
        currentPlayer: indexPlayer,
        status: attack?.hit,
      },
      id: 0,
    };

    return { req: stringifyMessage(request), turn };
  } else {
    const reqArray: string[] = [];
    attack?.cells.forEach((cell) => {
      const { x, y } = cell;
      request = {
        type: RequestTypeEnum.Attack,
        data: {
          position: {
            x,
            y,
          },
          currentPlayer: indexPlayer,
          status: attack?.hit,
        },
        id: 0,
      };
      reqArray.push(stringifyMessage(request));
    });
    attack?.aroundCells.forEach((cell) => {
      const { x, y } = cell;
      request = {
        type: RequestTypeEnum.Attack,
        data: {
          position: {
            x,
            y,
          },
          currentPlayer: indexPlayer,
          status: AttackStatusEnum.Miss,
        },
        id: 0,
      };
      reqArray.push(stringifyMessage(request));
    });
    return { req: reqArray, turn };
  }
};

export const getRandomAttack = (data: RandomAttackType) => {
  const { indexPlayer, gameId } = data;

  const gameIndex = currentGames.findIndex((game) => game.gameId === gameId);
  const opponentUser = currentGames[gameIndex].users.find((user) => user.indexPlayer !== indexPlayer);

  const randomCell = opponentUser?.board.randomAttack();

  const newAttackData: AttackType = {
    indexPlayer,
    gameId,
    x: randomCell?.x as number,
    y: randomCell?.y as number,
  };

  return getAttack(newAttackData);
};

export const createSingleGame = () => {};
