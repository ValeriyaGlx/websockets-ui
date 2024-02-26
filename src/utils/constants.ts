import { ShipTypeEnum, ShipsPositionsType } from '../types';

export const BOARD_WIDTH = 10;

export const MESSAGES = {
  connected: 'New client connected',
  disconnected: 'Client disconnected',
};

export const shipBotPositionArray: ShipsPositionsType[] = [
  {
    position: { x: 0, y: 5 },
    direction: false,
    type: ShipTypeEnum.Huge,
    length: 4,
  },
  {
    position: { x: 5, y: 4 },
    direction: false,
    type: ShipTypeEnum.Large,
    length: 3,
  },
  {
    position: { x: 7, y: 0 },
    direction: true,
    type: ShipTypeEnum.Large,
    length: 3,
  },
  {
    position: { x: 3, y: 2 },
    direction: false,
    type: ShipTypeEnum.Medium,
    length: 2,
  },
  {
    position: { x: 3, y: 7 },
    direction: true,
    type: ShipTypeEnum.Medium,
    length: 2,
  },
  {
    position: { x: 0, y: 3 },
    direction: false,
    type: ShipTypeEnum.Medium,
    length: 2,
  },
  {
    position: { x: 6, y: 7 },
    direction: true,
    type: ShipTypeEnum.Small,
    length: 1,
  },
  {
    position: { x: 3, y: 0 },
    direction: true,
    type: ShipTypeEnum.Small,
    length: 1,
  },
  {
    position: { x: 0, y: 0 },
    direction: true,
    type: ShipTypeEnum.Small,
    length: 1,
  },
  {
    position: { x: 9, y: 4 },
    direction: false,
    type: ShipTypeEnum.Small,
    length: 1,
  },
];
