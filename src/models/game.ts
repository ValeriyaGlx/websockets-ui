import { currentGames } from '../data';
import {
  AttackStatusEnum,
  AttackType,
  CurrentGameType,
  RequestAttackType,
  RequestTurn,
  RequestTypeEnum,
} from '../types';
import { stringifyMessage } from '../utils';

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

export const getAttack = (data: AttackType) => {
  const { x, y, gameId, indexPlayer } = data;
  const gameIndex = currentGames.findIndex((game) => game.gameId === gameId);
  const opponentUser = currentGames[gameIndex].users.find((user) => user.indexPlayer !== indexPlayer);
  const attack = opponentUser?.board.attack({ x, y });

  const turn = switchTurn(currentGames[gameIndex], attack?.hit);

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
      request = {
        type: RequestTypeEnum.Attack,
        data: {
          position: {
            x: cell.x,
            y: cell.y,
          },
          currentPlayer: indexPlayer,
          status: attack?.hit,
        },
        id: 0,
      };
      reqArray.push(stringifyMessage(request));
    });
    return { req: reqArray, turn };
  }
};
