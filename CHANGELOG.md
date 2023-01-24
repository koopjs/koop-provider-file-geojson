# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased
### Changed
* prefer use of data directory path from Model's options argument

## [2.0.0] - 2022-04-19
### Changed
* Remove buble build
* Remove demo-server
* Add package-lock

## [1.1.0] - 2020-04-13
### Fixed
* crash when files are not valid JSON

### Added
* Path can be passed via the koop options object
* Metadata set via geojson file with default options

## [1.0.1] - 2018-12-28
### Fixed
* Path to package.json in index.js

## [1.0.0] - 2018-12-27
Initial release of a simple provider for servering file-based GeoJSON. Good for debugging koop internals.

### Added
* Tests and travis build.

[2.0.0]: https://github.com/koopjs/koop-provider-file-geojson/compare/v1.1.0...v2.0.0
[1.1.0]: https://github.com/koopjs/koop-provider-file-geojson/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/koopjs/koop-provider-file-geojson/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/koopjs/koop-provider-file-geojson/releases/tag/v1.0.0