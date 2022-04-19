
# koop-provider-file-geojson

Serve local GeoJSON files as [Koop](https://github.com/koopjs/koop) services.  Use as a standalone Koop instance or add to an existing Koop implementation.

## Getting Started

Add the provider to your koop instance

``sh
$ npm install @koopjs/provider-file-geojson
``

Then register the provider with Koop in your server file.

```js
const Koop = require('koop')
const koop = new Koop()

const provider = require('@koopjs/provider-file-geojson')
koop.register(provider)
```

### Usage
The provider will look for requested geojson files in a `/data` directory in the koop application root. For example, the following request will serve data from the file `data/polygon-sample.geojson` :
```
$ curl http://localhost:8080/file-geojson/rest/services/polygon-sample/FeatureServer/0/query
```

## Usage
### Data directory  
By default, the provider looks for files in the `/data` directory in the koop application root. For example, the following request will serve data from the file `data/polygon-sample.geojson`:

```
$ curl http://localhost:8080/file-geojson/rest/services/polygon-sample/FeatureServer/0/query
```

You can override where the provider looks for geojson by setting an environment variable `KOOP_DATA_DIR=<path-to-directory>`.  The path should be relative to the koop server file.

### Files
All valid GeoJSON files can be served.  Place them in the data directory and ensure they have a `.geojson` file extension.

### Request parameters
Request a particular file by using the (extension-less) file name as the `:id` parameter in the URL.  For example, when requesting data from the file `point-fc.geojson`:
`http://localhost:8080/file-geojson/rest/services/:id/FeatureServer/0/query`

becomes:

`http://localhost:8080/file-geojson/rest/services/point-fc/FeatureServer/0/query` 

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/Esri/contributing).

## License

[Apache 2.0](LICENSE)
