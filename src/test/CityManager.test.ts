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
test('getCitiesOfPlayer', () => {
  const exampleMap: number[] = Array(16).fill(0);
  const cityManager = new CityManager([...exampleMap], 4, 4, []);
  let success = cityManager.createCity(exampleCity);
  expect(success).toBe(true);
  const exampleCity2 = {...exampleCity, cityPosition: {q: 3, r: 0, s: -3}};
  success = cityManager.createCity(exampleCity2);
  expect(success).toBe(true);
  const exampleCity3 = {...exampleCity, cityPosition: {q: 0, r: 2, s: -2}, cityPlayer: 2};
  success = cityManager.createCity(exampleCity3);
  expect(success).toBe(true);
  const cities = cityManager.getCitiesOfPlayer(1);
  expect(cities.length).toBe(2);
});
test('createCityBordersMoreCities', () => {
  const tileWidth = 34;
  const tileHeight = 32;
  const exampleMap: number[] = Array(16).fill(0);
  const cityManager = new CityManager([...exampleMap], 4, 4, []);
  let success = cityManager.createCity(exampleCity);
  expect(success).toBe(true);
  let tilePixelCoordinates = [
    { x: 0, y: 0 },
    { x: 34, y: 0 },
    { x: 17, y: 24 },
  ];
  cityManager.createCityBorders(1, tilePixelCoordinates, tileWidth, tileHeight);
  const exampleCity2 = {...exampleCity, cityPosition: {q: 2, r: 1, s: -3}};
  success = cityManager.createCity(exampleCity2);
  expect(success).toBe(true);
  tilePixelCoordinates = [
    { x: 85, y: 24 },
    { x: 68, y: 0 },
    { x: 102, y: 0 },
    { x: 102, y: 48 },
    { x: 68, y: 48 },
    { x: 51, y: 24 },
  ];
  cityManager.createCityBorders(2, tilePixelCoordinates, tileWidth, tileHeight);
  expect(exampleCity.cityBorders.length + exampleCity2.cityBorders.length).toBe(24);
});
