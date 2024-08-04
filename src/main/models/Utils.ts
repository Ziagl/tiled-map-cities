import { ICity } from '../interfaces/ICity';
import { ILine } from '../interfaces/ILine';
import { IPoint } from '../interfaces/IPoint';

export class Utils {
  // computes border lines of a hexagon tile by given center pixel coordinates and width/height of tile
  public static computeBordersOfTile(tileOrigin: IPoint, tileWidth: number, tileHeight: number): ILine[] {
    let borderLines: ILine[] = [];
    const tileCenter = { x: tileOrigin.x + tileWidth / 2, y: tileOrigin.y + tileHeight / 2 };
    // NW
    let startPoint = { x: tileCenter.x - tileWidth / 2, y: tileCenter.y - tileHeight / 4 };
    let endPoint = { x: tileCenter.x, y: tileCenter.y - tileHeight / 2 };
    borderLines.push({ start: startPoint, end: endPoint });
    // NE
    startPoint = endPoint;
    endPoint = { x: tileCenter.x + tileWidth / 2, y: tileCenter.y - tileHeight / 4 };
    borderLines.push({ start: startPoint, end: endPoint });
    // E
    startPoint = endPoint;
    endPoint = { x: tileCenter.x + tileWidth / 2, y: tileCenter.y + tileHeight / 4 };
    borderLines.push({ start: startPoint, end: endPoint });
    // SE
    startPoint = endPoint;
    endPoint = { x: tileCenter.x, y: tileCenter.y + tileHeight / 2 };
    borderLines.push({ start: startPoint, end: endPoint });
    // SW
    startPoint = endPoint;
    endPoint = { x: tileCenter.x - tileWidth / 2, y: tileCenter.y + tileHeight / 4 };
    borderLines.push({ start: startPoint, end: endPoint });
    // E
    startPoint = endPoint;
    endPoint = { x: tileCenter.x - tileWidth / 2, y: tileCenter.y - tileHeight / 4 };
    borderLines.push({ start: startPoint, end: endPoint });
    return borderLines;
  }
  // creates border lines for a city by given tile pixel coordinates and width/height of tile
  public static createBordersForCity(city: ICity, tileWidth: number, tileHeight: number) {
    let borderLines: ILine[] = [];
    // add tile borders for city center
    Utils.computeBordersOfTile(city.cityPositionPixel, tileWidth, tileHeight).forEach((tileBorder) => {
      borderLines.push(tileBorder);
    });
    // add tile borders for all city tiles
    city.cityTilesPixel.forEach((tile) => {
      const tileBorders = Utils.computeBordersOfTile(tile, tileWidth, tileHeight);
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
  // removes all duplicated border lines of different cities
  public static removeDuplicatedBorders(city: ICity, playerCities: ICity[]) {
    // check with list of all other player cities
    for (let i = 0; i < playerCities.length; ++i) {
      // skip current city
      if(playerCities[i]!.cityId == city.cityId) {
          continue;
      }
      // check all borders of current city against all other borders of all other cities
      let deletionIndex: number[] = [];
      for(let j = 0; j < playerCities[i]!.cityBorders.length; ++j) {
        for(let k=0; k < city.cityBorders.length; ++k) {
          if (
              ((playerCities[i]!.cityBorders[j]!.start.x === city.cityBorders[k]!.start.x &&
                playerCities[i]!.cityBorders[j]!.start.y === city.cityBorders[k]!.start.y &&
                playerCities[i]!.cityBorders[j]!.end.x === city.cityBorders[k]!.end.x &&
                playerCities[i]!.cityBorders[j]!.end.y === city.cityBorders[k]!.end.y) ||
                (playerCities[i]!.cityBorders[j]!.start.x === city.cityBorders[k]!.end.x &&
                  playerCities[i]!.cityBorders[j]!.start.y === city.cityBorders[k]!.end.y &&
                  playerCities[i]!.cityBorders[j]!.end.x === city.cityBorders[k]!.start.x &&
                  playerCities[i]!.cityBorders[j]!.end.y === city.cityBorders[k]!.start.y))
            ) {
              city.cityBorders!.splice(k, 1);
              deletionIndex.push(j);
              break;
          }
        }
      }
      for(let j=0; j < deletionIndex.length; ++j) {
        playerCities[i]!.cityBorders.splice(j, 1);
      }
    }
  }
}
