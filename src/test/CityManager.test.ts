import { CityManager } from '../main';
import { TileType } from '../main/enums/TileType';

const tileWidth = 34;
const tileHeight = 32;
const exampleCity = {
  cityId: 0,
  cityPlayer: 1,
  cityName: 'City1',
  cityPosition: { q: 0, r: 0, s: 0 },
  cityTiles: [
    { q: 1, r: 0, s: -1 },
    { q: 0, r: 1, s: -1 },
  ],
  cityPositionPixel: {x: 0, y: 0},
  cityTilesPixel: [{x: 34, y: 0}, {x: 17, y: 24}],
  cityBorders: [],
};

// creates a deep copy of defined example city
function createExampleCity() {
  return {...exampleCity, cityPosition: {...exampleCity.cityPosition}, cityTiles: [...exampleCity.cityTiles], 
  cityPositionPixel: {...exampleCity.cityPositionPixel}, cityTilesPixel: [...exampleCity.cityTilesPixel], cityBorders: []};
}
// creates a modified city for 2 city tests
function createExampleCity2() {
  const city = createExampleCity();
  city.cityPosition = { q: 3, r: 0, s: -3 };
  city.cityTiles = [{ q: 2, r: 0, s: -2 }, { q: 2, r: 1, s: -3 }];
  city.cityPositionPixel = {x: 102, y: 0};
  city.cityTilesPixel = [{x: 68, y: 0}, {x: 85, y: 24}];
  city.cityBorders = [];
  return city;
}

test('createCity', () => {
  const exampleMap: number[] = Array(16).fill(0);
  const cityManager = new CityManager([...exampleMap], 4, 4, []);
  const city = createExampleCity();
  const success = cityManager.createCity(city);
  expect(success).toBe(true);
  const output = cityManager.print();
  expect(output).toContain('1 0 0 0');
});
test('createCityCollision', () => {
  const exampleMap: number[] = Array(16).fill(0);
  exampleMap[0] = TileType.UNBUILDABLE;
  const cityManager = new CityManager([...exampleMap], 4, 4, [TileType.UNBUILDABLE]);
  const success = cityManager.createCity({...exampleCity});
  expect(success).toBe(false);
});
test('getCityById', () => {
  const exampleMap: number[] = Array(16).fill(0);
  const cityManager = new CityManager([...exampleMap], 4, 4, []);
  const city = createExampleCity();
  let success = cityManager.createCity(city);
  expect(success).toBe(true);
  const city1 = cityManager.getCityById(1);
  expect(city1).toBeDefined();
  expect(city1!.cityName).toBe('City1');
  const undefinedCity = cityManager.getCityById(2);
  expect(undefinedCity).toBeUndefined();
});
test('getCitiesOfPlayer', () => {
  const exampleMap: number[] = Array(16).fill(0);
  const cityManager = new CityManager([...exampleMap], 4, 4, []);
  const city = createExampleCity();
  let success = cityManager.createCity(city);
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
test('createCityBorders', () => {
  const exampleMap: number[] = Array(16).fill(0);
  const cityManager = new CityManager([...exampleMap], 4, 4, []);
  const city = createExampleCity();
  const success = cityManager.createCity(city);
  expect(success).toBe(true);
  cityManager.createCityBorders(city.cityPlayer, tileWidth, tileHeight);
  expect(city.cityBorders.length).toBe(12);
});
test('createCityBordersMoreCities', () => {
  const exampleMap: number[] = Array(16).fill(0);
  const cityManager = new CityManager([...exampleMap], 4, 4, []);
  const city = createExampleCity();
  let success = cityManager.createCity(city);
  expect(success).toBe(true);
  cityManager.createCityBorders(city.cityPlayer, tileWidth, tileHeight);
  const city2 = createExampleCity();
  city2.cityPosition = {q: 2, r: 1, s: -3};
  city2.cityTiles = [{ q: 2, r: 0, s: -2 }, { q: 3, r: 0, s: -3 }, {q: 1,  r: 1, s: -2}, {q: 1, r: 2, s: -3}, {q: 2, r: 2, s: -4}];
  city2.cityPositionPixel = {x: 85, y: 24};
  city2.cityTilesPixel = [{x: 68, y: 0}, {x: 102, y: 0}, {x: 51, y: 24}, {x: 68, y: 48}, {x: 102, y: 48}];
  city2.cityBorders = [];
  success = cityManager.createCity(city2);
  expect(success).toBe(true);
  cityManager.createCityBorders(city.cityPlayer, tileWidth, tileHeight);
  expect(city.cityBorders.length + city2.cityBorders.length).toBe(24);
});
test('addCityTile', () => {
  const exampleMap: number[] = Array(16).fill(0);
  let cityManager = new CityManager([...exampleMap], 4, 4, []);
  const city = createExampleCity();
  let success = cityManager.createCity(city);
  expect(success).toBe(true);
  let tile = { q: 1, r: 0, s: -1 }; // add tile to which is already part of city
  let tilePixel = {x: 34, y: 0};
  success = cityManager.addCityTile(1, tile, tilePixel);
  expect(success).toBe(false);
  tile = { q: 2, r: 0, s: -2 };     // add tile to which is not part of city
  tilePixel = {x: 68, y: 0};
  success = cityManager.addCityTile(1, tile, tilePixel);
  expect(success).toBe(true);
  expect(city.cityTiles.length).toBe(3);
});
test('addCityTileNotValid', () => {
  const exampleMap: number[] = Array(16).fill(0);
  const cityManager = new CityManager([...exampleMap], 4, 4, []);
  const city = createExampleCity();
  expect(city.cityTiles.length).toBe(2);
  let success = cityManager.createCity(city);
  expect(success).toBe(true);
  let tile = { q: 3, r: 0, s: -3 }; // add tile with a gap to city fails
  let tilePixel = {x: 102, y: 0};
  success = cityManager.addCityTile(1, tile, tilePixel);
  expect(success).toBe(false);
  tile = { q: 2, r: 0, s: -2 };     // close the gap
  tilePixel = {x: 68, y: 0};
  success = cityManager.addCityTile(1, tile, tilePixel);
  expect(success).toBe(true);
  tile = { q: 3, r: 0, s: -3 };     // now same tile can be added
  tilePixel = {x: 102, y: 0};
  success = cityManager.addCityTile(1, tile, tilePixel);
  expect(success).toBe(true);
  expect(city.cityTiles.length).toBe(4);
});
test('addCityTileCollisionWithOtherCity', () => {
  const exampleMap: number[] = Array(16).fill(0);
  const cityManager = new CityManager([...exampleMap], 4, 4, []);
  const city = createExampleCity();
  let success = cityManager.createCity(city);
  expect(success).toBe(true);
  const city2 = createExampleCity2();
  success = cityManager.createCity(city2);
  expect(success).toBe(true);
  const tile = { q: 2, r: 0, s: -2 };
  const tilePixel = {x: 68, y: 0};
  success = cityManager.addCityTile(1, tile, tilePixel);
  expect(success).toBe(false);
});
test('createCityBordersAfterTileWasAdded', () => {
  const exampleMap: number[] = Array(16).fill(0);
  const cityManager = new CityManager([...exampleMap], 4, 4, []);
  const city = createExampleCity();
  let success = cityManager.createCity(city);
  expect(success).toBe(true);
  cityManager.createCityBorders(city.cityPlayer, tileWidth, tileHeight);
  expect(city.cityBorders.length).toBe(12);
  const tile = { q: 1, r: 1, s: -2 };
  const tilePixel =  {x: 51, y: 24};
  success = cityManager.addCityTile(1, tile, tilePixel);
  expect(success).toBe(true);
  cityManager.createCityBorders(city.cityPlayer, tileWidth, tileHeight);
  expect(city.cityBorders.length).toBe(14);
});
test('createCityBordersMoreCitiesAndAddTile', () => {
  const exampleMap: number[] = Array(16).fill(0);
  const cityManager = new CityManager([...exampleMap], 4, 4, []);
  const city = createExampleCity();
  let success = cityManager.createCity(city);
  expect(success).toBe(true);
  cityManager.createCityBorders(city.cityPlayer, tileWidth, tileHeight);
  const city2 = createExampleCity2();
  success = cityManager.createCity(city2);
  expect(success).toBe(true);
  cityManager.createCityBorders(city.cityPlayer, tileWidth, tileHeight);
  expect(city.cityBorders.length + city2.cityBorders.length).toBe(22);
  const tile = { q: 1, r: 1, s: -2 };
  const tilePixel = {x: 51, y: 24};
  success = cityManager.addCityTile(1, tile, tilePixel);
  expect(success).toBe(true);
  cityManager.createCityBorders(city.cityPlayer, tileWidth, tileHeight);
  expect(city.cityBorders.length + city2.cityBorders.length).toBe(20);
});
test('createCityBordersTwoCitiesOneGrowing', () => {
  const exampleMap: number[] = Array(25).fill(0);
  const cityManager = new CityManager([...exampleMap], 5, 5, []);
  const city = createExampleCity();
  city.cityPosition = { q: -1, r: 0, s: 1 };
  city.cityTiles = [{ q: 0, r: -1, s: 1 }, { q: 0, r: 0, s: 0 }, { q: -1, r: 1, s: 0 }, { q: -2, r: 1, s: 1 }, { q: -2, r: 0, s: 2 }, { q: -1, r: -1, s: 2 }];
  city.cityPositionPixel = {x: -34, y: 0};
  city.cityTilesPixel = [{x: -17, y: -24}, {x: 0, y: 0}, {x: -17, y: 24}, {x: -51, y: 24}, {x: -68, y: 0}, {x: -51, y: -24} ];
  city.cityBorders = [];
  let success = cityManager.createCity(city);
  expect(success).toBe(true);
  const city2 = createExampleCity();
  city2.cityName = 'City2';
  city2.cityPosition = { q: 1, r: 1, s: -2 };
  city2.cityTiles = [{ q: 2, r: 0, s: -2 }, { q: 2, r: 1, s: -3 }, { q: 1, r: 2, s: -3 }, { q: 0, r: 2, s: -2 }, { q: 0, r: 1, s: -1 }, { q: 1, r: 0, s: -1 }];
  city2.cityPositionPixel = {x: 51, y: 24};
  city2.cityTilesPixel = [{x: 68, y: 0}, {x: 85, y: 24}, {x: 68, y: 48}, {x: 34, y: 48}, {x: 17, y: 24}, {x: 34, y: 0}];
  city2.cityBorders = [];
  success = cityManager.createCity(city2);
  expect(success).toBe(true);
  cityManager.createCityBorders(city.cityPlayer, tileWidth, tileHeight);
  expect(city.cityBorders.length).toBe(15);
  expect(city2.cityBorders.length).toBe(15);
  // add tile to city 1
  success = cityManager.addCityTile(1, { q: 1, r: -1, s: 0 }, {x: 17, y: -24});
  expect(success).toBe(true);
  cityManager.createCityBorders(city.cityPlayer, tileWidth, tileHeight);
  expect(city.cityBorders.length).toBe(16);
  expect(city2.cityBorders.length).toBe(14);
  // add tile to city 1
  success = cityManager.addCityTile(1, { q: -1, r: 2, s: -1 }, {x: 0, y: 48});
  expect(success).toBe(true);
  cityManager.createCityBorders(city.cityPlayer, tileWidth, tileHeight);
  expect(city.cityBorders.length).toBe(18);
  expect(city2.cityBorders.length).toBe(12);
});