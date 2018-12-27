const fs = require('fs')
const path = require('path')
const dataDir = process.env.DATA_DIR || './data'
const dataDirPath = path.join(process.cwd(), dataDir)

// Stat the directory to ensure it exists
fs.stat(dataDirPath, function (err, stats) {
  if (err && err.errno === -2) {
    err.message = `Data directory "${dataDirPath}" not found; ${err.message}`
  }
  if (err) throw err
  console.log(`GeoJSON files will be read from: ${dataDirPath}`)
})

/**
 * Model constructor
 */
function Model () {}

/**
 * Fetch data from source.  Pass result or error to callback.
 * This is the only public function you need to implement on Model
 * @param {object} express request object
 * @param {function} callback
 */
Model.prototype.getData = function (req, callback) {
  let filename = `${req.params.id}.geojson`
  fs.readFile(`${dataDir}/${filename}`, (err, dataBuffer) => {
    if (err && err.errno === -2) {
      err.code = 404
      err.message = `File "${filename}" not found.`
    } else if (err) {
      err.code = 500
    }
    if (err) return callback(err)

    // translate the response into geojson
    const geojsonStr = dataBuffer.toString()
    const geojson = translate(JSON.parse(geojsonStr))

    // Cache data for 10 seconds at a time by setting the ttl or "Time to Live"
    geojson.ttl = 10

    // Add metadata
    geojson.metadata = geojson.metadata || {}
    geojson.metadata.title = 'Koop GeoJSON'
    geojson.metadata.name = filename
    geojson.metadata.description = `GeoJSON from ${filename}`
    callback(null, geojson)
  })
}

/**
 * GeoJSON to convert into required Koop format
 * @param {object} input GeoJSON
 * @returns {object} standardized feature collection
 */
function translate (input) {
  // If input type is Feature, wrap in Feature Collection
  if (input.type === 'Feature') {
    return {
      type: 'FeatureCollection',
      features: [input],
      metadata: {
        geometryType: input.geometry.type
      }
    }
  }

  // If it's neither a Feature or a FeatureCollection its a geometry.  Wrap in a Feature Collection
  if (input.type !== 'FeatureCollection') {
    return {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: input,
        properties: {}
      }],
      metadata: {
        geometryType: input.type
      }
    }
  }

  // Or its already feature collection
  const geometryType = input.features && input.features[0] && input.features[0].geometry && input.features[0].geometry.type
  input.metadata = { geometryType }
  return input
}

module.exports = Model
