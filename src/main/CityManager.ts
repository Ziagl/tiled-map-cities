import { defineHex, HexOffset, Orientation } from "honeycomb-grid";
import { ICity } from "./interfaces/ICity";
import { Utils } from "@ziagl/tiled-map-utils";
import { TileType } from "./enums/TileType";

export class CityManager {
    private _cityStore: Map<number, ICity>;
    private _lastCityStoreId: number = 0;
    private _map: number[][] = [];  // 2D array of numbers
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
        this._map = Utils.convertTo2DArray(map, rows, columns);
        this._map_columns = columns;

        // initilize definition to convert offset -> cube coordinates
        const hexSetting = { offset: -1 as HexOffset, orientation: Orientation.POINTY };
        this._hexDefinition = defineHex(hexSetting);

        // initialize city store
        this._cityStore = new Map<number, ICity>();
    }

    public createCity(city: ICity): boolean {
        // early exit if layer position is already occupied
        const unitId = Utils.getUnitIdOnPosition(city.cityPosition, this._map!, this._hexDefinition);
        if (unitId != TileType.EMPTY) {
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
     * print generated map structured (one row as one line)
     * @returns string representation of map
     */
    public print(): string {
        let response: string = '';
        for (let i = 0; i < this._map_columns; ++i) {
            // @ts-ignore
            const row = this._map[i];
            // @ts-ignore
            response += row.join(' ');
            if (i < this._map_columns - 1) {
                response += '\n';
            }
        }
        return response;
    }
}