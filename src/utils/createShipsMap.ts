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
    return { allCellsKilled, cells: this.cells };
  }

  findCellsAround() {
    const aroundCells: Cell[] = [];
    for (const cell of this.cells) {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const x = cell.x + dx;
          const y = cell.y + dy;
          if (x >= 0 && x < 10 && y >= 0 && y < 10 && !this.cells.some((cell) => cell.x === x && cell.y === y)) {
            const aroundCell: Cell = { x, y };
            aroundCells.push(aroundCell);
          }
        }
      }
    }
    return aroundCells;
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

  attack(point: Cell): { hit: AttackStatusEnum; cells: Cell[] | []; aroundCells: Cell[] | [] } {
    for (const ship of this.ships) {
      for (const cell of ship.cells) {
        if (cell.x === point.x && cell.y === point.y) {
          ship.shot(point);
          const isKilled = ship.isKilled();
          return {
            hit: isKilled.allCellsKilled ? AttackStatusEnum.Killed : AttackStatusEnum.Shot,
            cells: isKilled.allCellsKilled ? ship.isKilled().cells : [],
            aroundCells: isKilled.allCellsKilled ? ship.findCellsAround() : [],
          };
        }
      }
    }
    return { hit: AttackStatusEnum.Miss, cells: [], aroundCells: [] };
  }
}
