import { ResponseAddShipsType, ShipsPositionsType, UserType } from '../types';
import { shipBotPositionArray } from './constants';

export class Bot {
  name: string;
  password: string;
  index: number;
  ships: ShipsPositionsType[];

  constructor() {
    this.name = `Bot ${Date.now()}`;
    this.password = `Bot-${Date.now()}`;
    this.index = -Date.now();
    this.ships = shipBotPositionArray;
  }

  getBotData() {
    const data: UserType = {
      name: this.name,
      password: this.password,
      index: this.index,
    };

    return data;
  }

  getBotShipsPosition() {
    const data: ResponseAddShipsType = {
      gameId: 0,
      ships: this.ships,
      indexPlayer: this.index,
    };

    return data;
  }
}
