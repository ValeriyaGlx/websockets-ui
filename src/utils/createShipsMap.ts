import { AttackStatusEnum, ShipTypeEnum, ShipsPositionsType } from '../types';

type Cell = {
  x: number;
  y: number;
};

export class Ship {
  position: Cell;
  direction: boolean;
  type: ShipTypeEnum;
  length: number;
  shots: boolean[];
  cells: Cell[];

  constructor(ship: ShipsPositionsType) {
    const { position, direction, type, length } = ship;
    this.position = position;
    this.direction = direction;
    this.type = type;
    this.length = length;
    this.shots = new Array(length).fill(false);
    this.cells = [];
    this.initializeCells();
  }

  private initializeCells(): void {
    for (let i = 0; i < this.length; i++) {
      if (this.direction) {
        this.cells.push({ x: this.position.x, y: this.position.y + i });
      } else {
        this.cells.push({ x: this.position.x + i, y: this.position.y });
      }
    }
  }

  isKilled() {
    const allCellsKilled = this.shots.every((cell) => cell);
    return { allCellsKilled, cells: this.cells }; // возвращает true, если все точки корабля поражены
  }

  shot(cell: Cell) {
    if (this.direction) {
      const relativeY = cell.y - this.position.y;
      this.shots[relativeY] = true;
    } else {
      const relativeX = cell.x - this.position.x;
      this.shots[relativeX] = true;
    }
  }
}

export class GameBoard {
  width: number;
  height: number;
  ships: Ship[];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.ships = [];
  }

  placeShip(ship: Ship): void {
    this.ships.push(ship);
  }

  attack(point: Cell): { hit: AttackStatusEnum; cells: Cell[] | [] } {
    for (const ship of this.ships) {
      for (const cell of ship.cells) {
        if (cell.x === point.x && cell.y === point.y) {
          ship.shot(point);
          return {
            hit: ship.isKilled().allCellsKilled ? AttackStatusEnum.Killed : AttackStatusEnum.Shot,
            cells: ship.isKilled().allCellsKilled ? ship.isKilled().cells : [],
          };
        }
      }
    }
    return { hit: AttackStatusEnum.Miss, cells: [] };
  }
}
