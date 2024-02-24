import { AttackStatusEnum, ShipTypeEnum, ShipsPositionsType } from '../types';
import { BOARD_WIDTH } from './constants';

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
          if (
            x >= 0 &&
            x < BOARD_WIDTH &&
            y >= 0 &&
            y < BOARD_WIDTH &&
            !this.cells.some((cell) => cell.x === x && cell.y === y)
          ) {
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
  usedCells: Cell[];

  constructor() {
    this.width = BOARD_WIDTH;
    this.height = BOARD_WIDTH;
    this.ships = [];
    this.usedCells = [];
  }

  placeShip(ship: Ship): void {
    this.ships.push(ship);
  }

  attack(point: Cell): { hit: AttackStatusEnum; cells: Cell[] | []; aroundCells: Cell[] | [] } | undefined {
    for (const ship of this.ships) {
      for (const cell of ship.cells) {
        if (cell.x === point.x && cell.y === point.y) {
          ship.shot(point);
          const isKilled = ship.isKilled();
          isKilled.allCellsKilled
            ? this.usedCells.push(...isKilled.cells, ...ship.findCellsAround())
            : this.usedCells.push(point);
          return {
            hit: isKilled.allCellsKilled ? AttackStatusEnum.Killed : AttackStatusEnum.Shot,
            cells: isKilled.allCellsKilled ? isKilled.cells : [],
            aroundCells: isKilled.allCellsKilled ? ship.findCellsAround() : [],
          };
        }
      }
    }
    return { hit: AttackStatusEnum.Miss, cells: [], aroundCells: [] };
  }

  randomAttack(): Cell {
    const availableCells: Cell[] = [];
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const cell: Cell = { x, y };
        if (!this.usedCells.some((usedCell) => usedCell.x === x && usedCell.y === y)) {
          availableCells.push(cell);
        }
      }
    }
    const randomIndex = Math.floor(Math.random() * availableCells.length);
    this.usedCells.push(availableCells[randomIndex]);
    return availableCells[randomIndex];
  }
}
