# geo-coord

This library contains utilities for managing geographic coordinate data.

## Usage

``` 
const geoCoord = require("geo-coord");
```

## Conversion

### latitudeToDecimal(degrees, minutes, seconds, hemisphere)

Converts the given latitude coordinate from degrees, minutes, seconds, and hemisphere ("N" or "S") to its decimal representation. The result will be positive for the northern hemisphere, and negative for the southern hemisphere.

The validity of the parameters will be checked, and any values outside of their range will result in an error thrown:

* degrees: [0..90]
* minutes: [0..60[
* seconds: [0..60[
* hemisphere: "N" or "S"
* result: [-90..90]

#### Examples

``` 
latitudeToDecimal(0, 0, 0, "N"); // 0
latitudeToDecimal(0, 0, 0, "S"); // -0
latitudeToDecimal(60, 30, 0, "N"); // 60.5
latitudeToDecimal(20, 15, 36, "S"); // -20.26
```

### longitudeToDecimal(degrees, minutes, seconds, hemisphere)

Converts the given longitude coordinate from degrees, minutes, seconds, and hemisphere ("E" or "W") to its decimal representation. The result will be positive for the eatern hemisphere, and negative for the western hemisphere.

The validity of the parameters will be checked, and any values outside of their range will result in an error thrown:

* degrees: [0..180]
* minutes: [0..60[
* seconds: [0..60[
* hemisphere: "E" or "W"
* result: [-180..180]

## Roadmap

The goal with the library is to become a more comprehensive library for any calculations and manipulations of geological coordinates.

Planned features:

* Convert from (fully or partially) decimal to degrees, minutes, seconds, and hemisphere
* Full coordinate conversions (latitude + longitude)
* Formatting to textual presentation
* Parsing from textual presentation
* Distance between coordinates
