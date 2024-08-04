import { CubeCoordinates } from 'honeycomb-grid';
import { ILine } from './ILine';
import { IPoint } from './IPoint';

export interface ICity {
  // base
  cityId: number;
  cityPlayer: number;
  cityName: string;
  // position
  cityPosition: CubeCoordinates;
  cityTiles: CubeCoordinates[];
  // UI
  cityPositionPixel: IPoint;      // absolute position in pixels
  cityTilesPixel: IPoint[];       // absolute positions in pixels
  cityBorders: ILine[];           // border lines in absolute pixels
  // TODO: add more properties
}
