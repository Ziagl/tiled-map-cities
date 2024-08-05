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
  // removes all duplicated border lines of all cities
  public static removeDuplicatedBorders(playerCities: ICity[]) {
    // create a list of all border lines of all cities
    let allBorders: {cityId: number, borderLine: ILine}[] = [];
    playerCities.forEach((city) => {
      city.cityBorders.forEach((border) => {
        allBorders.push({cityId: city.cityId, borderLine: border});
      });
      city.cityBorders = [];
    });
    // find border lines that are unique
    let uniqueBorders: {cityId: number, borderLine: ILine}[] = [];
    for(let i = 0; i < allBorders.length; ++i) {
      let isUnique = true;
      for(let j = 0; j < allBorders.length; ++j) {
        if(i == j) {
          continue;
        }
        if(
          ((allBorders[i]!.borderLine.start.x === allBorders[j]!.borderLine.start.x &&
            allBorders[i]!.borderLine.start.y === allBorders[j]!.borderLine.start.y &&
            allBorders[i]!.borderLine.end.x === allBorders[j]!.borderLine.end.x &&
            allBorders[i]!.borderLine.end.y === allBorders[j]!.borderLine.end.y) ||
            (allBorders[i]!.borderLine.start.x === allBorders[j]!.borderLine.end.x &&
              allBorders[i]!.borderLine.start.y === allBorders[j]!.borderLine.end.y &&
              allBorders[i]!.borderLine.end.x === allBorders[j]!.borderLine.start.x &&
              allBorders[i]!.borderLine.end.y === allBorders[j]!.borderLine.start.y))
        ) {
          isUnique = false;
          break;
        }
      }
      if(isUnique) {
        uniqueBorders.push(allBorders[i]!);
      }
    }
    // refill borders of all cities
    playerCities.forEach((city) => {
      uniqueBorders.forEach((border) => {
        if(border.cityId == city.cityId) {
          city.cityBorders.push(border.borderLine);
        }
      });
    });
  }
}
