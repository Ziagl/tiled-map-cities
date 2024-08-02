import { defineHex, HexOffset, Orientation } from 'honeycomb-grid';
import { ICity } from './interfaces/ICity';
import { Utils } from '@ziagl/tiled-map-utils';
import { TileType } from './enums/TileType';
import { ILine } from './interfaces/ILine';
import { IPoint } from './interfaces/IPoint';
import { Utils as LocalUtils } from './models/Utils';

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
   * creates all surrounding border lines of all city tiles and saves result for city object
   * @param cityId id of city
   * @param cityTiles city tiles as pixel coordinates
   * @param tileWidth width of tile in pixel
   * @param tileHeight height of tile in pixel
   */
  public createCityBorders(cityId: number, cityTiles: IPoint[], tileWidth: number, tileHeight: number) {
    let borderLines: ILine[] = [];
    const city = this._cityStore.get(cityId);
    // early exit if city does not exist
    if (city === undefined) {
      return;
    }
    // compute border lines for each tile
    cityTiles.forEach((tile) => {
      const tileBorders = LocalUtils.computeBordersOfTile(tile, tileWidth, tileHeight);
      tileBorders.forEach((tileBorder) => {
        let inList = false;
        // if tile borders already in list, remove them
        for (let i = 0; i < borderLines.length; ++i) {
          if (
            borderLines != undefined &&
            ((borderLines[i]!.start.x === tileBorder.start.x &&
              borderLines[i]!.start.y === tileBorder.start.y &&
              borderLines[i]!.end.x === tileBorder.end.x &&
              borderLines[i]!.end.y === tileBorder.end.y) ||
              (borderLines[i]!.start.x === tileBorder.end.x &&
                borderLines[i]!.start.y === tileBorder.end.y &&
                borderLines[i]!.end.x === tileBorder.start.x &&
                borderLines[i]!.end.y === tileBorder.start.y))
          ) {
            inList = true;
            borderLines.splice(i, 1);
            break;
          }
        }
        // add tile borders if not already in list
        if (!inList) {
          borderLines.push(tileBorder);
        }
      });
    });
    city.cityBorders = borderLines;
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
