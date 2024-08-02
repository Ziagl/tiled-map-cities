import { ILine } from '../interfaces/ILine';
import { IPoint } from '../interfaces/IPoint';

export class Utils {
  // computes border lines of a hexagon tile by given center pixel coordinates and width/height of tile
  public static computeBordersOfTile(tileCenter: IPoint, tileWidth: number, tileHeight: number): ILine[] {
    let borderLines: ILine[] = [];
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
}
