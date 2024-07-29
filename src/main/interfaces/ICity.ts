import { CubeCoordinates } from 'honeycomb-grid';

export interface ICity {
    // base
    cityId: number;
    cityPlayer: number;
    cityName: string;
    // position
    cityPosition: CubeCoordinates;
    cityTiles: CubeCoordinates[];
    // TODO: add more properties
}