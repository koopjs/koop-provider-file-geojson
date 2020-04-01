const fs = require('fs')
const path = require('path')

/**
 * Model constructor
 */
function Model (koop) {
  const dataDir = koop.dataDir || process.env.DATA_DIR || './data'
  this.dataDirPath = path.join(process.cwd(), dataDir)
  this.log = koop.log
  this.verifyPathExists(this.dataDirPath)
}

Model.prototype.verifyPathExists = function verifyPathExists (dataDirPath) {
  // Stat the directory to ensure it exists
  const that = this
  fs.stat(dataDirPath, function (err) {
    if (err && err.errno === -2) {
      err.message = `Data directory "${dataDirPath}" not found; ${err.message}`
    }

    if (err) {
      throw err
    }

    that.log.warn(`GeoJSON files will be read from: ${dataDirPath}`)
  })
}

/**
 * Fetch data from source.  Pass result or error to callback.
 * This is the only public function you need to implement on Model
 * @param {object} express request object
 * @param {function} callback
 */
Model.prototype.getData = function getData(req, callback) {
  const filename = `${req.params.id}.geojson`
  const filePath = `${this.dataDirPath}/${filename}`
  const that = this
  fs.readFile(filePath, (err, dataBuffer) => {
    if (err && err.errno === -2) {
      err.code = 404
      err.message = 'File not found'
      that.log.error(`${err.message}: ${filePath}`)
    } else if (err) {
      err.code = 500
    }

    if (err) {
      return callback(err)
    }

    try {
      // translate the response into geojson
      const geojsonStr = dataBuffer.toString()
      const geojsonParsed = JSON.parse(geojsonStr)
      const metadataCopy = geojsonParsed.metadata
      const geojson = translate(geojsonParsed)

      // Cache data for 10 seconds at a time by setting the ttl or "Time to Live"
      geojson.ttl = metadataCopy.ttl || 10

      const detectedGeometryType = geojson.metadata.geometryType
      // Add metadata
      geojson.metadata = metadataCopy || {}
      geojson.metadata.geometryType = detectedGeometryType
      geojson.metadata.title = (metadataCopy && metadataCopy.title) || 'Koop GeoJSON'
      geojson.metadata.name = (metadataCopy && metadataCopy.name) || filename
      geojson.metadata.description = (metadataCopy && metadataCopy.description) || `GeoJSON from ${filename}`
      return callback(null, geojson)
    } catch (err) {
      that.log.error(`Error parsing file ${filePath}: ${err.message}`)
      err.message = 'Error parsing file as JSON.'
      err.code = 500
      return callback(err)
    }
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
