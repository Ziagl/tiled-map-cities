import { CityManager } from '../main';
import { TileType } from '../main/enums/TileType';

const exampleCity = {
  cityId: 0,
  cityPlayer: 1,
  cityName: 'City1',
  cityPosition: { q: 0, r: 0, s: 0 },
  cityTiles: [
    { q: 1, r: 0, s: -1 },
    { q: 0, r: 1, s: -1 },
  ],
  cityBorders: [],
};

test('createCity', () => {
  const exampleMap: number[] = Array(16).fill(0);
  const cityManager = new CityManager([...exampleMap], 4, 4, []);
  const success = cityManager.createCity(exampleCity);
  expect(success).toBe(true);
  const output = cityManager.print();
  expect(output).toContain('1 0 0 0');
});
test('createCityCollision', () => {
  const exampleMap: number[] = Array(16).fill(0);
  exampleMap[0] = TileType.UNBUILDABLE;
  const cityManager = new CityManager([...exampleMap], 4, 4, [TileType.UNBUILDABLE]);
  const success = cityManager.createCity(exampleCity);
  expect(success).toBe(false);
});
test('createCityBorders', () => {
  const exampleMap: number[] = Array(16).fill(0);
  const cityManager = new CityManager([...exampleMap], 4, 4, []);
  const success = cityManager.createCity(exampleCity);
  expect(success).toBe(true);
  const tilePixelCoordinates = [
    { x: 0, y: 0 },
    { x: 34, y: 0 },
    { x: 17, y: 24 },
  ];
  cityManager.createCityBorders(1, tilePixelCoordinates, 34, 32);
  expect(exampleCity.cityBorders.length).toBe(12);
});
