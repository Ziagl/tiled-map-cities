import { CubeCoordinates } from 'honeycomb-grid';
import { ILine } from './ILine';

export interface ICity {
  // base
  cityId: number;
  cityPlayer: number;
  cityName: string;
  // position
  cityPosition: CubeCoordinates;
  cityTiles: CubeCoordinates[];
  // UI
  cityBorders: ILine[];
  // TODO: add more properties
}
