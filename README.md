
# koop-provider-file-geojson

Serve local GeoJSON files as [Koop](https://github.com/koopjs/koop) services.  Use as a standalone Koop instance or add to an existing Koop implementation.

## Getting Started

Add the provider to your koop instance

``sh
$ npm install @koopjs/provider-file-geojson
``

Then register the provider with Koop in your server file.

``js
const Koop = require('koop')
const koop = new Koop()

const provider = require('@koopjs/provider-file-geojson')
koop.register(provider)
``

### Example server
The repository includes its own `server.js` that will start a Koop instance and register the file-geojson provider.  To start serving:

```sh
git clone https://github.com/koopjs/koop-provider-file-geojson

cd koop-provider-file-geojson

$ npm install

$ npm start
```

By default, Koop will start listening on `http://localhost:8080`.  Since the repo ships with sample GeoJSON in the `/data` directory, you can issue a request by using the extension-less filenames of GeoJSON found there.  For example, the following request will serve data from the file `data/polygon-sample.geojson` :
```
$ curl http://localhost:8080/file-geojson/rest/services/polygon-sample/FeatureServer/0/query
```

## Usage
### Data directory  
By default, the provider looks for files in the `data` directory that ships with the provider.  You can override this by setting an environment variable `KOOP_DATA_DIR=<path-to-directory>`.  The path should be relative to the `server.js` file.

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
