const test = require('tape')
const proxyquire = require('proxyquire')
const fsStub = {}
const Model = proxyquire('../src/model', { 'fs': fsStub })
const model = new Model({})
const pointFc = require('./fixtures/point-fc.json')
const pointF = require('./fixtures/point-f.json')
const point = require('./fixtures/point.json')

test('should properly feature collection geojson', t => {
  t.plan(4)

  fsStub.readFile = function (thePath, callback) {
    process.nextTick(function () {
      callback(null, Buffer.from(JSON.stringify(pointFc), 'utf8'))
    })
  }
  model.getData({ params: { id: 'point-fc' } }, (err, geojson) => {
    t.notOk(err, 'no error')
    t.equals(geojson.metadata.geometryType, 'Point')
    t.equals(geojson.type, 'FeatureCollection')
    t.ok(geojson.features, 'has features')
  })
})

test('should properly feature geojson', t => {
  t.plan(4)

  fsStub.readFile = function (thePath, callback) {
    process.nextTick(function () {
      callback(null, Buffer.from(JSON.stringify(pointF), 'utf8'))
    })
  }
  model.getData({ params: { id: 'point-f' } }, (err, geojson) => {
    t.notOk(err, 'no error')
    t.equals(geojson.metadata.geometryType, 'Point')
    t.equals(geojson.type, 'FeatureCollection')
    t.ok(geojson.features, 'has features')
  })
})

test('should properly geometry geojson', t => {
  t.plan(4)

  fsStub.readFile = function (thePath, callback) {
    process.nextTick(function () {
      callback(null, Buffer.from(JSON.stringify(point), 'utf8'))
    })
  }
  model.getData({ params: { id: 'point' } }, (err, geojson) => {
    t.notOk(err, 'no error')
    t.equals(geojson.metadata.geometryType, 'Point')
    t.equals(geojson.type, 'FeatureCollection')
    t.ok(geojson.features, 'has features')
  })
})
