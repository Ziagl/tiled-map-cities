import { CubeCoordinates } from 'honeycomb-grid';

export interface ICity {
    // base
    cityId: number;
    cityPlayer: number;
    // position
    cityPosition: CubeCoordinates;
    cityTiles: CubeCoordinates[];
    // TODO: add more properties
}