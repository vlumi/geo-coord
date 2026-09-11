# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- The string parser accepts a hemisphere letter before its numbers as well as after: `N35.6812 E139.7671`, `N 35 40 52 E 139 46 2`, `S33.8688 W151.2093`. A letter glued to its number on either side (`N35.68`, `139.77E`) is split off, so `35.6812N 139.7671E` parses too.

## [0.3.0] - 2026-09-10

### Added

- Spherical geodesy: `distanceKm`, `initialBearing`, `finalBearing`, `destination`, `midpoint`, `interpolate`, on the IUGG mean radius `MEAN_EARTH_RADIUS_KM` or a radius of your choice
- Longitude utilities: `normalizeLongitude`, `longitudeDelta`, `unwrapPath`, `splitAtAntimeridian`
- Formatting: `formatCoordinates`, `formatLatitude`, `formatLongitude` with decimal or DMS style, precision, hemisphere letters, localized words, or signs, and custom symbols
- Compass points: `compassPoint`, `compassIndex`, `COMPASS_POINTS` for 4, 8, or 16 points
- Types: `GeodesyOptions`, `FormatOptions`, `CompassPoints`

## [0.2.0] - 2026-05-18

### Added

- TypeScript type exports: `DMS`, `DDCoordinates`, `DMSCoordinates`, `Hemisphere`, `LatitudeHemisphere`, `LongitudeHemisphere`
- Dual ESM/CJS distribution via `package.json` `exports`; types emitted as `.d.ts` and `.d.cts`
- GitHub Actions CI verifying lint, typecheck, tests, and build on Node 20, 22, 24, and 26
- Release workflow that publishes to npm with provenance via OIDC Trusted Publishing

### Changed

- Library rewritten in TypeScript with full strict mode (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`)
- Invalid input now throws `Error` instances instead of string literals
- Test runner: Jest → Vitest
- Linter: legacy `.eslintrc.js` → ESLint 10 flat config with typescript-eslint
- Build: `tsup` (esbuild) for ESM/CJS/d.ts emission

### Removed

- Support for Node.js below 20

## [0.1.1] - 2020-08-04

### Added

- Rounding methods on `GeoCoord`: `roundToSeconds()`, `roundToMinutes()`, `roundToDegrees()` — each returns a new `GeoCoord` rounded to the requested precision

## [0.1.0] - 2020-07-12

### Added

- `GeoCoord` wrapper class for parsing and normalizing coordinate input and producing transformed output
- `latitudeToDMS` and `longitudeToDMS` conversion functions

### Changed

- Rename `latitudeToDecimal` → `latitudeToDD`
- Rename `longitudeToDecimal` → `longitudeToDD`

## 0.0.2 - 2020-07-11

### Fixed

- Documentation corrections

## 0.0.1 - 2020-07-11

### Added

- Initial release with `latitudeToDecimal` and `longitudeToDecimal` conversion functions

[Unreleased]: https://github.com/vlumi/geo-coord/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/vlumi/geo-coord/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/vlumi/geo-coord/releases/tag/v0.2.0
[0.1.1]: https://github.com/vlumi/geo-coord/releases/tag/v0.1.1
[0.1.0]: https://github.com/vlumi/geo-coord/releases/tag/v0.1.0
