# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/vlumi/geo-coord/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/vlumi/geo-coord/releases/tag/v0.2.0
[0.1.1]: https://github.com/vlumi/geo-coord/releases/tag/v0.1.1
[0.1.0]: https://github.com/vlumi/geo-coord/releases/tag/v0.1.0
