import { Utils } from '../main/models/Utils';

test('computeBordersOfTile', () => {
  const tileWidth = 34;
  const tileHeight = 32;
  let output = Utils.computeBordersOfTile({ x: -(tileWidth / 2), y: -(tileHeight / 2) }, tileWidth, tileHeight);
  expect(output.length).toBe(6);
  expect(output[0]).toEqual({ start: { x: -17, y: -8 }, end: { x: 0, y: -16 } });
  expect(output[1]).toEqual({ start: { x: 0, y: -16 }, end: { x: 17, y: -8 } });
  expect(output[2]).toEqual({ start: { x: 17, y: -8 }, end: { x: 17, y: 8 } });
  expect(output[3]).toEqual({ start: { x: 17, y: 8 }, end: { x: 0, y: 16 } });
  expect(output[4]).toEqual({ start: { x: 0, y: 16 }, end: { x: -17, y: 8 } });
  expect(output[5]).toEqual({ start: { x: -17, y: 8 }, end: { x: -17, y: -8 } });
});
