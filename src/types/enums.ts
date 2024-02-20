export enum ResponseTypeEnum {
  Registration = 'reg',
  CreateRoom = 'create_room',
  AddUserToRoom = 'add_user_to_room',
  AddShips = 'add_ships',
  Attack = 'attack',
  Finish = 'finish',
}

export enum RequestTypeEnum {
  Registration = 'reg',
  UpdateWinners = 'update_winners',
  UpdateRoom = 'update_room',
  CreateGame = 'create_game',
  StartGame = 'start_game',
  Turn = 'turn',
}

export enum AttackStatusEnum {
  Miss = 'miss',
  Killed = 'killed',
  Shot = 'shot',
}
