# geo-coord

This library contains utilities for managing geographic coordinate values.
Try it in the [interactive demo](https://vlumi.github.io/geo-coord/demo/):
paste a coordinate in any notation and see it parsed, formatted, and measured
against a second point.

The current functionality includes:

- Parsing and normalizing coordinate values into decimal degrees
- Converting the values to normalized DMS (degrees, minutes, seconds) with hemisphere information
- Rounding the coordinates to a given precision: full degrees, minutes, or seconds
- Spherical geodesy: distance, bearings, destination, midpoint, interpolation along a great circle
- Longitude utilities: normalizing, shortest difference, and unwrapping or cutting paths at the antimeridian
- Formatting coordinates as decimal degrees or DMS, with hemisphere letters, words, or signs
- Compass points for a bearing, with 4, 8, or 16 points

## Usage

### Parsing as functions

```ts
import { parseCoordinates, tryParseCoordinates } from "geo-coord";

parseCoordinates("35°40′52″N 139°46′2″E");   // { latitude: 35.68111…, longitude: 139.76722… }
parseCoordinates("N35.6812 E139.7671");       // hemisphere letters before or after, spaced or glued
parseCoordinates("-33 52 7.68 151 12 33.48"); // signed DMS, no letters
parseCoordinates("geo:35.6812,139.7671;u=35"); // RFC 5870 geo URI
tryParseCoordinates("nowhere");               // null instead of an exception
```

Both accept everything the `GeoCoord` constructor below accepts. Every other
function takes and returns `Coordinates`, a `{ latitude, longitude }` object in
decimal degrees. `fromLonLat([lon, lat])` and `toLonLat(coords)` convert to and
from the `[longitude, latitude]` tuples GeoJSON and map libraries use;
`isValidLatitude` and `isValidLongitude` check a number is finite and in range.

### GeoCoord Class

```ts
import { GeoCoord } from "geo-coord";
```

Methods:

- `toString()` – Return in the format `"0°0′0.00″N 0°0′0.00″E"`
- `toDD()` – Return in the format `{ latitude: 0.00, longitude: 0.00 }`
- `toDMS()` – Return in format `{ latitude: { degrees: 0, minutes: 0, seconds: 0.00, hemisphere: "N" }, longitude: { ... } }`
- `roundToDegrees()` – Return a new object rounded to full degrees.
- `roundToMinutes()` – Return a new object rounded to full minutes.
- `roundToSeconds()` – Return a new object rounded to full seconds.

#### Constructing

The constructor accepts various ways pass the coordinates. The following examples all create a GeoCoord object at the origo.

- Pass a string with the DMS latitude and longitude, each token separated by a character, in the respective order. The hemisphere letter may follow or lead its numbers, spaced or glued:

```ts
new GeoCoord("0°0′0″N 0°0′0″E");
new GeoCoord("N0°0′0″ E0°0′0″");
new GeoCoord("0.0N 0.0E");
new GeoCoord("N0.0 E0.0");
```

- Pass the DMS values of longitude and latitude as discrete values, in the respective order, possibly omitting any unnecessary values from the tail:

```ts
new GeoCoord(0, 0, 0, "N", 0, 0, 0, "E");
new GeoCoord(0, "N", 0, 0, "E");
new GeoCoord(0, "N", 0, "E");
```

- Pass an object with `latitude` and `longitude` properties holding the DMS values in individual properties:

```ts
new GeoCoord({
  latitude: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "N" },
  longitude: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "E" },
});
```

- Pass the objects for latitude and longitude as separate parameters, in respective order:

```ts
new GeoCoord(
  { degrees: 0, minutes: 0, seconds: 0, hemisphere: "N" },
  { degrees: 0, minutes: 0, seconds: 0, hemisphere: "E" }
);
```

- Pass an object with `latitude` and `longitude` properties holding the DD values:

```ts
new GeoCoord({
  latitude: 0,
  longitude: 0,
});
```

- Pass the DD values for latitude and longitude as separate parameters, in respective order:

```ts
new GeoCoord(0, 0)
```

#### toString()

Returns the coordinates in a full string representation, in the format:

```text
<d>°<m>′<s>″<H> <d>°<m>′<s>″<E>
```

##### Examples

```ts
// Returns: "0°0′0″N 0°0′0″E"
new GeoCoord(0, 0).toString();

// Returns: "1°2′3″N 4°5′6″E"
new GeoCoord({
  latitude: { degrees: 1, minutes: 2, seconds: 3, hemisphere: "N" },
  longitude: { degrees: 4, minutes: 5, seconds: 6, hemisphere: "E" },
}).toString()

// Returns: "60°10′15″N 24°56′15″E"
new GeoCoord(
  { degrees: 60, minutes: 10, seconds: 15, hemisphere: "N" },
  { degrees: 24, minutes: 56, seconds: 15, hemisphere: "E" }
).toString();

// Returns: "60°10′15″N 24°56′15″E"
new GeoCoord("60°10′15″N 24°56′15″E").toString();

// Returns: "60°10′15″N 24°56′15″E"
new GeoCoord("60 10 15 N 24 56 15 E").toString();

// Returns: "60°10′15″N 24°56′15″E"
new GeoCoord(60, 10, 15, "N", 24, 56, 15, "E").toString();
```

#### to()

Returns the coordinates in decimal degrees, in the format:

```text
{
  latitude: <d.d>
  longitude: <d.d>
}
```

##### Examples

```ts
// Returns: { latitude: 0, longitude: 0 }
new GeoCoord(0, 0).toDD();

// Returns: { latitude: 60.170833333333334, longitude: 24.9375 }
new GeoCoord(
  { degrees: 60, minutes: 10, seconds: 15, hemisphere: "N" },
  { degrees: 24, minutes: 56, seconds: 15, hemisphere: "E" }
).toDD();

```

#### toDMS()

```ts
// Returns:
//  {
//   latitude: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "N" },
//   longitude: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "E" },
// }
new GeoCoord(0, 0).toDMS();

// Returns:
//  {
//   latitude: { degrees: 60, minutes: 10, seconds: 15, hemisphere: "N" },
//   longitude: { degrees: 24, minutes: 56, seconds: 15, hemisphere: "E" },
// }
new GeoCoord(
  { degrees: 60, minutes: 10, seconds: 15, hemisphere: "N" },
  { degrees: 24, minutes: 56, seconds: 15, hemisphere: "E" }
).toDMS();

```

### Conversion Functions

```ts
import {
  latitudeToDD,
  latitudeToDMS,
  longitudeToDD,
  longitudeToDMS,
} from "geo-coord";
```

#### latitudeToDD(degrees, minutes, seconds, hemisphere)

Converts the given latitude coordinate from degrees, minutes, seconds, and hemisphere ("N" or "S") to its decimal representation. The result will be positive for the northern hemisphere, and negative for the southern hemisphere.

The validity of the parameters will be checked, and any values outside of their range will result in an error thrown:

- degrees: [0..90]
- minutes: [0..60[
- seconds: [0..60[
- hemisphere: "N" or "S"
- result: [-90..90]

##### Examples

```ts
// Returns: 0
latitudeToDD(0, 0, 0, "N");

// Returns: -0
latitudeToDD(0, 0, 0, "S");

// Returns: 60.5
latitudeToDD(60, 30, 0, "N");

// Returns: -20.26
latitudeToDD(20, 15, 36, "S");
```

#### latitudeToDMS(decimalDegrees)

Converts the given latitude coordinates from decimal degrees to degrees, minutes, seconds, and hemisphere. The decimal degrees are expected to be negative for the souther hemisphere, and positive for the northern hemisphere.

The validity of the parameter will be checked, and any value outside of its range will result in an error throw:

- decimalDegrees: [-90..90]

##### Examples

```ts
// Returns: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "N" }
latitudeToDMS(0);

// Returns: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "S" }
latitudeToDMS(-0);

// Returns: { degrees: 60, minutes: 30, seconds: 0, hemisphere: "N" }
latitudeToDMS(60.5);

// Returns: { degrees: 20, minutes: 15, seconds: 36, hemisphere: "S" }
latitudeToDMS(-20.26);
```

#### longitudeToDD(degrees, minutes, seconds, hemisphere)

Converts the given longitude coordinate from degrees, minutes, seconds, and hemisphere ("E" or "W") to its decimal representation. The result will be positive for the eatern hemisphere, and negative for the western hemisphere.

The validity of the parameters will be checked, and any values outside of their range will result in an error thrown:

- degrees: [0..180]
- minutes: [0..60[
- seconds: [0..60[
- hemisphere: "E" or "W"
- result: [-180..180]

##### Examples

```ts
// Returns: 0
longitudeToDD(0, 0, 0, "E");

// Returns: -0
longitudeToDD(0, 0, 0, "W");

// Returns: 60.5
longitudeToDD(60, 30, 0, "E");

// Returns: -20.26
longitudeToDD(20, 15, 36, "W");
```

#### longitudeToDMS(decimalDegrees)

Converts the given longitude coordinates from decimal degrees to degrees, minutes, seconds, and hemisphere. The decimal degrees are expected to be negative for the western hemisphere, and positive for the eastern hemisphere.

The validity of the parameter will be checked, and any value outside of its range will result in an error throw:

- decimalDegrees: [-180..180]

##### Examples

```ts
// Returns: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "E" }
longitudeToDMS(0);

// Returns: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "W" }
longitudeToDMS(-0);

// Returns: { degrees: 60, minutes: 30, seconds: 0, hemisphere: "E" }
longitudeToDMS(60.5);

// Returns: { degrees: 20, minutes: 15, seconds: 36, hemisphere: "W" }
longitudeToDMS(-20.26);
```

### Geodesy

```ts
import {
  distanceKm,
  initialBearing,
  finalBearing,
  destination,
  midpoint,
  interpolate,
  MEAN_EARTH_RADIUS_KM,
} from "geo-coord";
```

All functions take and return `{ latitude, longitude }` objects in decimal degrees and treat the Earth as a sphere. Distances are in kilometres on the IUGG mean radius, 6371.0088 km, exported as `MEAN_EARTH_RADIUS_KM`; pass `{ radiusKm }` as the last argument to `distanceKm` and `destination` to measure on another sphere, such as the WGS84 equatorial radius 6378.137 km. Bearings are degrees clockwise from north in `[0, 360)`.

```ts
const helsinki = { latitude: 60.1699, longitude: 24.9384 };
const tokyo = { latitude: 35.6762, longitude: 139.6503 };

// Great-circle distance: about 7818 km
distanceKm(helsinki, tokyo);

// Bearing when leaving Helsinki, and when arriving in Tokyo
initialBearing(helsinki, tokyo);
finalBearing(helsinki, tokyo);

// The point 100 km east of Helsinki
destination(helsinki, 90, 100);

// Halfway, and a tenth of the way, along the great circle
midpoint(helsinki, tokyo);
interpolate(helsinki, tokyo, 0.1);
```

### Longitude

```ts
import {
  normalizeLongitude,
  longitudeDelta,
  unwrapPath,
  splitAtAntimeridian,
} from "geo-coord";
```

- `normalizeLongitude(longitude)` – The equivalent longitude in `[-180, 180)`: `190` becomes `-170`, `180` becomes `-180`.
- `longitudeDelta(from, to)` – The shortest signed way round, positive eastward: from `170` to `-170` is `20`.
- `unwrapPath(path)` – The path with longitudes shifted by whole turns so that no step jumps across the antimeridian; a crossing continues past ±180°, which most renderers accept for a single ring.
- `splitAtAntimeridian(path)` – The path cut into pieces at each crossing, each piece ending on its edge and the next starting on the opposite edge at the interpolated latitude; pieces of one point are dropped.

### Formatting

```ts
import { formatCoordinates, formatLatitude, formatLongitude } from "geo-coord";
```

```ts
const tokyo = { latitude: 35.6812, longitude: 139.7671 };

// "35.6812°N 139.7671°E"
formatCoordinates(tokyo);

// "35.68°N 139.77°E"
formatCoordinates(tokyo, { precision: 2 });

// "35°40′52″N 139°46′2″E"
formatCoordinates(tokyo, { style: "dms" });

// "35°40′52.3″N"
formatLatitude(tokyo.latitude, { style: "dms", precision: 1 });

// "35.6812, 139.7671"
formatCoordinates(tokyo, { hemisphere: "sign", symbols: { degrees: "" }, separator: ", " });

// "北緯35度40分52秒 東経139度46分2秒"
formatCoordinates(tokyo, {
  style: "dms",
  hemispheres: { N: "北緯", S: "南緯", E: "東経", W: "西経" },
  hemispherePosition: "before",
  symbols: { degrees: "度", minutes: "分", seconds: "秒" },
});
```

Options:

- `style` – `"dd"` (default) or `"dms"`.
- `precision` – Decimals of the degrees for `"dd"` (default 4), of the seconds for `"dms"` (default 0). Rounding carries over, so `59.99999` in DMS is `60°0′0″`, and a value that rounds to zero is north or east.
- `hemisphere` – `"letter"` (default) marks the hemisphere with N, S, E, W; `"sign"` puts a minus on southern and western values instead.
- `hemispheres` – Replacements for any of the letters, for localized words.
- `hemispherePosition` – `"after"` (default) or `"before"` the number.
- `symbols` – Replacements for `°`, `′`, `″`.
- `separator` – Between latitude and longitude in `formatCoordinates`, a space by default.

Latitudes outside `[-90, 90]` and longitudes outside `[-180, 180]` throw.

### Compass

```ts
import { compassPoint, compassIndex, COMPASS_POINTS } from "geo-coord";
```

- `compassPoint(bearing, points = 8)` – The English abbreviation of the nearest of 4, 8, or 16 compass points: `compassPoint(44)` is `"NE"`, `compassPoint(22.5, 16)` is `"NNE"`.
- `compassIndex(bearing, points = 8)` – The same as an index clockwise from north, for looking up a localized name.
- `COMPASS_POINTS` – The sixteen abbreviations, clockwise from north.

## Roadmap

The goal with the library is to become a more comprehensive library for any calculations and manipulations of geological coordinates.

Planned features:

- Geodesy on the WGS84 ellipsoid (Vincenty) where the sphere is not accurate enough
- Coordinate transformations

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release notes.
