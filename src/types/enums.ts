export enum ResponseTypeEnum {
  Registration = 'reg',
  CreateRoom = 'create_room',
  AddUserToRoom = 'add_user_to_room',
  AddShips = 'add_ships',
  Attack = 'attack',
  RandomAttack = 'randomAttack',
}

export enum RequestTypeEnum {
  Registration = 'reg',
  UpdateWinners = 'update_winners',
  UpdateRoom = 'update_room',
  CreateGame = 'create_game',
  StartGame = 'start_game',
  Turn = 'turn',
  Attack = 'attack',
  Finish = 'finish',
}

export enum AttackStatusEnum {
  Miss = 'miss',
  Killed = 'killed',
  Shot = 'shot',
}

export enum ShipTypeEnum {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  Huge = 'huge',
}
