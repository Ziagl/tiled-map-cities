import { CityManager } from '../main';

const exampleCity = {
  cityId: 0,
  cityPlayer: 1,
  cityPosition: { q: 0, r: 0, s: 0 },
  cityTiles: [{ q: 1, r: 0, s: -1 }, { q: 0, r: 1, s: -1 }],
};

test('createCity', () => {
    const exampleSeaMap: number[] = Array(16).fill(0);
    const unitManager = new CityManager([...exampleSeaMap], 4, 4, []);
    const success = unitManager.createCity(exampleCity);
    expect(success).toBe(true);
    const output = unitManager.print();
    expect(output).toContain('1 0 0 0');
  });