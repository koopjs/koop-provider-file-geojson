/*
  index.js

  This file is required. It's role is to specify configuration settings.

  Documentation: http://koopjs.github.io/docs/specs/provider/
*/

const provider = {
    type: 'provider',
    name: 'geojson',
    hosts: false,
    disableIdParam: false,
    Model: require('./model'),
    version: require('./package.json').version
  }
  
  module.exports = provider
  