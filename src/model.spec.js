const fs = require('fs-extra');
const Model = require('./model');
jest.spyOn(fs, 'readFile');
const mockLogger = {
  warn: () => {},
  error: () => {},
  info: () => {},
};
const fakeKoop = {
  logger: mockLogger,
};

const { promisify } = require('util');

describe('Model class', () => {
  describe('constructor', () => {
    test('sets options', async () => {
      const model = new Model(fakeKoop, {
        dataDir: './test/fixtures',
        ttl: 99,
      });
      expect(model).toBeDefined();
    });

    test('sets defaults', async () => {
      const model = new Model(fakeKoop, {
        dataDir: './test/fixtures',
      });
      expect(model).toBeDefined();
    });

    test('throws error on bad data dir', () => {
      try {
        new Model(fakeKoop, { dataDir: 'foo' });
        fail('should have thrown');
      } catch (error) {
        expect(error.message).toEqual(
          'File GeoJSON provider: data directory "foo" not found.',
        );
      }
    });
  });

  describe('getData', () => {
    test('gets geojson feature collection file and adds metadata', async () => {
      const model = new Model(fakeKoop, {
        dataDir: './test/fixtures',
        ttl: 99,
      });

      const getData = promisify(model.getData).bind(model);
      const geojson = await getData({ params: { id: 'point-fc' } });
      expect(geojson).toEqual({
        features: [
          {
            geometry: { coordinates: [-104.9476, 39.9448], type: 'Point' },
            properties: {},
            type: 'Feature',
          },
        ],
        metadata: {
          description: 'GeoJSON from point-fc.json',
          geometryType: 'Point',
          name: 'point-fc.json',
          title: 'Koop File GeoJSON',
        },
        ttl: 99,
        type: 'FeatureCollection',
      });
    });

    test('gets geojson feature collection file (.geojson) and adds metadata', async () => {
      const model = new Model(fakeKoop, {
        dataDir: './test/fixtures/geojson',
        ttl: 99,
      });

      const getData = promisify(model.getData).bind(model);
      const geojson = await getData({ params: { id: 'point-fc' } });
      expect(geojson).toEqual({
        features: [
          {
            geometry: { coordinates: [-104.9476, 39.9448], type: 'Point' },
            properties: {},
            type: 'Feature',
          },
        ],
        metadata: {
          description: 'GeoJSON from point-fc.geojson',
          geometryType: 'Point',
          name: 'point-fc.geojson',
          title: 'Koop File GeoJSON',
        },
        ttl: 99,
        type: 'FeatureCollection',
      });
    });

    test('gets geojson feature file and adds metadata', async () => {
      const model = new Model(fakeKoop, {
        dataDir: './test/fixtures',
        ttl: 99,
      });

      const getData = promisify(model.getData).bind(model);
      const geojson = await getData({ params: { id: 'point-f' } });
      expect(geojson).toEqual({
        features: [
          {
            geometry: {
              coordinates: [-121.14486694336, 47.884118004966],
              type: 'Point',
            },
            properties: {},
            type: 'Feature',
          },
        ],
        metadata: {
          description: 'GeoJSON from point-f.json',
          geometryType: 'Point',
          name: 'point-f.json',
          title: 'Koop File GeoJSON',
        },
        ttl: 99,
        type: 'FeatureCollection',
      });
    });

    test('gets geojson geometry file and adds metadata', async () => {
      const model = new Model(fakeKoop, {
        dataDir: './test/fixtures',
        ttl: 99,
      });

      const getData = promisify(model.getData).bind(model);
      const geojson = await getData({ params: { id: 'point' } });
      expect(geojson).toEqual({
        features: [
          {
            geometry: {
              coordinates: [-121.14486694336, 47.884118004966],
              type: 'Point',
            },
            properties: {},
            type: 'Feature',
          },
        ],
        metadata: {
          description: 'GeoJSON from point.json',
          geometryType: 'Point',
          name: 'point.json',
          title: 'Koop File GeoJSON',
        },
        ttl: 99,
        type: 'FeatureCollection',
      });
    });

    test('404s when file not found', async () => {
      const model = new Model(fakeKoop, {
        dataDir: './test/fixtures',
        ttl: 99,
      });

      const getData = promisify(model.getData).bind(model);

      try {
        await getData({ params: { id: 'foo' } });
        throw new Error('should have thrown');
      } catch (error) {
        expect(error.message).toEqual(
          'File GeoJSON provider: foo.json not found',
        );
        expect(error.code).toEqual(404);
      }
    });

    test('500s if error reading file', async () => {
      fs.readFile.mockImplementationOnce(() => {
        throw new Error('cannot read');
      });
      const Model = require('./model');
      const model = new Model(fakeKoop, {
        dataDir: './test/fixtures',
        ttl: 99,
      });

      const getData = promisify(model.getData).bind(model);

      try {
        await getData({ params: { id: 'point-fc' } });
        throw new Error('should have thrown');
      } catch (error) {
        expect(error.message).toEqual('File GeoJSON provider: cannot read');
        expect(error.code).toEqual(500);
      }
    });

    test('500s if unparseable JSON', async () => {
      fs.readFile.mockImplementationOnce(() => {
        return 'not-json';
      });
      const Model = require('./model');
      const model = new Model(fakeKoop, {
        dataDir: './test/fixtures',
        ttl: 99,
      });

      const getData = promisify(model.getData).bind(model);

      try {
        await getData({ params: { id: 'point-fc' } });
        throw new Error('should have thrown');
      } catch (error) {
        expect(error.message).toEqual(
          'File GeoJSON provider: unparsable JSON in point-fc.json',
        );
      }
    });
  });
});

// test('should properly get feature collection geojson', t => {
//   t.plan(4)

//   fsStub.readFile = function (thePath, callback) {
//     process.nextTick(function () {
//       callback(null, Buffer.from(JSON.stringify(pointFc), 'utf8'))
//     })
//   }
//   model.getData({ params: { id: 'point-fc' } }, (err, geojson) => {
//     t.notOk(err, 'no error')
//     t.equals(geojson.metadata.geometryType, 'Point')
//     t.equals(geojson.type, 'FeatureCollection')
//     t.ok(geojson.features, 'has features')
//   })
// })

// test('should properly get feature geojson', t => {
//   t.plan(4)

//   fsStub.readFile = function (thePath, callback) {
//     process.nextTick(function () {
//       callback(null, Buffer.from(JSON.stringify(pointF), 'utf8'))
//     })
//   }
//   model.getData({ params: { id: 'point-f' } }, (err, geojson) => {
//     t.notOk(err, 'no error')
//     t.equals(geojson.metadata.geometryType, 'Point')
//     t.equals(geojson.type, 'FeatureCollection')
//     t.ok(geojson.features, 'has features')
//   })
// })

// test('should properly get geometry geojson', t => {
//   t.plan(4)

//   fsStub.readFile = function (thePath, callback) {
//     process.nextTick(function () {
//       callback(null, Buffer.from(JSON.stringify(point), 'utf8'))
//     })
//   }
//   model.getData({ params: { id: 'point' } }, (err, geojson) => {
//     t.notOk(err, 'no error')
//     t.equals(geojson.metadata.geometryType, 'Point')
//     t.equals(geojson.type, 'FeatureCollection')
//     t.ok(geojson.features, 'has features')
//   })
// })
