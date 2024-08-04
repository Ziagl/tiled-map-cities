import { CubeCoordinates, defineHex, HexOffset, Orientation } from 'honeycomb-grid';
import { ICity } from './interfaces/ICity';
import { Utils } from '@ziagl/tiled-map-utils';
import { TileType } from './enums/TileType';
import { Utils as LocalUtils } from './models/Utils';
import { IPoint } from './interfaces/IPoint';

export class CityManager {
  private _cityStore: Map<number, ICity>;
  private _lastCityStoreId: number = 0;
  private _map: number[][] = []; // 2D array of numbers
  private _map_columns: number = 0;
  private _hexDefinition;

  constructor(map: number[], rows: number, columns: number, notPassableTiles: number[]) {
    let mapArray = new Array<number>();
    map.forEach((value) => {
      if (notPassableTiles !== undefined) {
        // @ts-ignore
        if (notPassableTiles.includes(value)) {
          mapArray.push(TileType.UNBUILDABLE);
        } else {
          mapArray.push(TileType.EMPTY);
        }
      } else {
        mapArray.push(TileType.EMPTY);
      }
    });
    this._map = Utils.convertTo2DArray(mapArray, rows, columns);
    this._map_columns = columns;

    // initilize definition to convert offset -> cube coordinates
    const hexSetting = { offset: -1 as HexOffset, orientation: Orientation.POINTY };
    this._hexDefinition = defineHex(hexSetting);

    // initialize city store
    this._cityStore = new Map<number, ICity>();
  }

  /**
   * creates a new city, returns false if not possible
   * @param city city to create
   * @returns true if city was created, false if position is already occupied
   */
  public createCity(city: ICity): boolean {
    // early exit if layer position is already occupied
    const cityId = Utils.getUnitIdOnPosition(city.cityPosition, this._map!, this._hexDefinition);
    if (cityId != TileType.EMPTY) {
      return false;
    }
    // add city to store
    this._lastCityStoreId = this._lastCityStoreId + 1;
    city.cityId = this._lastCityStoreId;
    this._cityStore.set(city.cityId, city);
    Utils.setUnitIdOnPosition(city.cityPosition, this._map!, this._hexDefinition, city.cityId);
    return true;
  }

  /**
   * creates all surrounding border lines of all city tiles and saves result for city object for all cities
   * @param playerId id of player to create borders for
   * @param tileWidth width of tile in pixel
   * @param tileHeight height of tile in pixel
   */
  public createCityBorders(playerId: number, tileWidth: number, tileHeight: number) {
    const playerCities = this.getCitiesOfPlayer(playerId);
    // create all borders for all cities individually
    playerCities.forEach((city) => {
      LocalUtils.createBordersForCity(city, tileWidth, tileHeight);
    });
    // remove all duplicated borders (overlapping cities)
    playerCities.forEach((city) => {
      LocalUtils.removeDuplicatedBorders(city, playerCities);
    });
  }

  /**
   * adds a new tile to a city, returns false if not possible
   * @param cityId id of city that should grow
   * @param tile new tile of city
   * @param tilePixel pixel position of tile
   * @returns true if tile was added, false if tile is already part of city or not a valid neighbor
   */
  public addCityTile(cityId: number, tile: CubeCoordinates, tilePixel: IPoint): boolean {
    const city = this._cityStore.get(cityId);
    // early exit if city does not exist
    if (city === undefined) {
      return false;
    }
    // early exit if tile is city position
    if(city.cityPosition.q === tile.q && city.cityPosition.r === tile.r && city.cityPosition.s === tile.s) {
      return false;
    }
    // early exit if tile is already part of city
    for(let i = 0; i < city.cityTiles.length; ++i) {
      if(city.cityTiles[i]!.q === tile.q && city.cityTiles[i]!.r === tile.r && city.cityTiles[i]!.s === tile.s) {
        return false;
      }
    }
    // check if given tile is a valid neighbor of city
    let validNeighbor = false;
    for(let i = 0; i < city.cityTiles.length; ++i) {
      // NE
      if(city.cityTiles[i]!.q + 1 === tile.q && 
        city.cityTiles[i]!.r - 1 === tile.r && 
        city.cityTiles[i]!.s === tile.s) {
          validNeighbor = true;
          break;
      }
      // E
      if(city.cityTiles[i]!.q + 1 === tile.q && 
        city.cityTiles[i]!.r === tile.r && 
        city.cityTiles[i]!.s - 1 === tile.s) {
          validNeighbor = true;
          break;
      }
      // SE
      if(city.cityTiles[i]!.q === tile.q && 
        city.cityTiles[i]!.r + 1 === tile.r && 
        city.cityTiles[i]!.s - 1 === tile.s) {
          validNeighbor = true;
          break;
      }
      // SW
      if(city.cityTiles[i]!.q - 1 === tile.q && 
        city.cityTiles[i]!.r + 1 === tile.r && 
        city.cityTiles[i]!.s === tile.s) {
          validNeighbor = true;
          break;
      }
      // W
      if(city.cityTiles[i]!.q - 1 === tile.q && 
        city.cityTiles[i]!.r === tile.r && 
        city.cityTiles[i]!.s + 1 === tile.s) {
          validNeighbor = true;
          break;
      }
      // NW
      if(city.cityTiles[i]!.q === tile.q && 
        city.cityTiles[i]!.r - 1 === tile.r && 
        city.cityTiles[i]!.s + 1 === tile.s) {
          validNeighbor = true;
          break;
      }
    }
    if(!validNeighbor) {
      return false;
    }
    // check if tile is not already occupied by another city
    validNeighbor = true;
    const playerCities = this.getCitiesOfPlayer(city.cityPlayer);
    for (let i = 0; i < playerCities.length; ++i) {
      // skip current city
      if(playerCities[i]!.cityId == cityId) {
        continue;
      }
      if(playerCities[i]!.cityPosition.q === tile.q && playerCities[i]!.cityPosition.r === tile.r && playerCities[i]!.cityPosition.s === tile.s) {
        validNeighbor = false;
        break;
      }
      for(let j = 0; j < playerCities[i]!.cityTiles.length; ++j) {
        if (
            ((playerCities[i]!.cityTiles[j]!.q === tile.q &&
              playerCities[i]!.cityTiles[j]!.r === tile.r &&
              playerCities[i]!.cityTiles[j]!.s === tile.s))
          ) {
            validNeighbor = false;
            break;
          }
      }
    }
    if(!validNeighbor) {
      return false;
    }
    // add tile to city
    city.cityTiles.push(tile);
    city.cityTilesPixel.push(tilePixel);
    return true;
  }

  /**
   * get city by id
   * @param cityId id of city
   * @returns city if found, undefined if not found
   */
  public getCityById(cityId: number): ICity | undefined {
    return this._cityStore.get(cityId);
  }

  /**
   * all cities of given player number
   * @param playerId player id to search for
   * @returns array of cities for given player, if no unit was found, empty array
   */
  public getCitiesOfPlayer(playerId: number): ICity[] {
    let cities: ICity[] = [];
    this._cityStore.forEach((city) => {
      if (city.cityPlayer === playerId) {
        cities.push(city);
      }
    });
    return cities;
  }

  /**
   * print generated map structured (one row as one line)
   * @returns string representation of map
   */
  public print(): string {
    let response: string = '';
    for (let i = 0; i < this._map_columns; ++i) {
      const row = this._map[i];
        if(row !== undefined) {
        response += row.join(' ');
        if (i < this._map_columns - 1) {
            response += '\n';
        }
      }
    }
    return response;
  }
}
