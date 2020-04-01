const fs = require('fs')
const path = require('path')

/**
 * Model constructor
 */
function Model (koop) {
  const dataDir = koop.dataDir || process.env.DATA_DIR || './data'
  this.dataDirPath = path.join(process.cwd(), dataDir)
  verifyPathExists(this.dataDirPath)
}

function verifyPathExists (dataDirPath) {
  // Stat the directory to ensure it exists
  fs.stat(dataDirPath, function (err) {
    if (err && err.errno === -2) {
      err.message = `Data directory "${dataDirPath}" not found; ${err.message}`
    }

    if (err) {
      throw err
    }

    console.log(`GeoJSON files will be read from: ${dataDirPath}`)
  })
}

/**
 * Fetch data from source.  Pass result or error to callback.
 * This is the only public function you need to implement on Model
 * @param {object} express request object
 * @param {function} callback
 */
Model.prototype.getData = function (req, callback) {
  const filePath = `${this.dataDirPath}/${req.params.id}.geojson`
  fs.readFile(filePath, (err, dataBuffer) => {
    if (err && err.errno === -2) {
      err.code = 404
      err.message = 'File not found'
      console.log(`${err.message}: ${filePath}`)
    } else if (err) {
      err.code = 500
    }

    if (err) {
      return callback(err)
    }

    try {
      const geojsonStr = dataBuffer.toString()
      const geojson = JSON.parse(geojsonStr)
      return callback(null, geojson)
    } catch (err) {
      console.log(`Error parsing file ${filePath}: ${err.message}`)
      err.message = 'Error parsing file as JSON.'
      err.code = 500
      return callback(err)
    }
  })
}

module.exports = Model
