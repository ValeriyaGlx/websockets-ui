import { UserType } from '../types';

export class Bot {
  name: string;
  password: string;
  index: number;

  constructor() {
    this.name = `Bot ${Date.now()}`;
    this.password = `Bot-${Date.now()}`;
    this.index = -Date.now();
  }

  getBotData() {
    const data: UserType = {
      name: this.name,
      password: this.password,
      index: this.index,
    };

    return data;
  }
}
