import { AttackStatusEnum, CurrentGameType, RequestTurn, RequestTypeEnum } from '../types';
import { stringifyMessage } from '../utils';

export const switchTurn = (game: CurrentGameType, command?: AttackStatusEnum) => {
  const { users } = game;
  let turn: number = 0;
  switch (command) {
    case AttackStatusEnum.Killed:
      break;
    case AttackStatusEnum.Miss:
      break;
    case AttackStatusEnum.Shot:
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
