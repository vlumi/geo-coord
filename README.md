# geo-coord

This library contains utilities for managing geographic coordinate data.

## Usage

### GeoCoord Class

``` 
const { GeoCoord } = require("geo-coord");
```

#### Constructing

The constructor accepts various ways pass the coordinates. The following examples all create a GeoCoord object at the origo.

* Pass an object with `latitude` and `longitude` properties holding the coordinates in individual properties:

``` 
new GeoCoord({
  latitude: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "N" },
  longitude: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "E" },
});
```

* Pass the objects for latitude and longitude as separate parameters, in respective order:

``` 
new GeoCoord(
  { degrees: 0, minutes: 0, seconds: 0, hemisphere: "N" },
  { degrees: 0, minutes: 0, seconds: 0, hemisphere: "E" }
)
```

* Pass an object with `latitude` and `longitude` properties holding the decimal values:

``` 
new GeoCoord({
  latitude: 0,
  longitude: 0,
})
```

* Pass the decimal values for latitude and longitude as separate parameters, in respective order:

``` 
new GeoCoord(0, 0)
```

#### toString()

Returns the coordinates in a full string representation, in the format:

``` 
<d>° <m>′ <s>″ <H> <d>° <m′ <s>″ <E>
```

##### Examples

``` 
// Returns: "0° 0′ 0″ N 0° 0′ 0″ E"
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
```

#### toDecimal()

Returns the coordinates in decimal degrees, in the format:

``` 
{
  latitude: <d.d>
  longitude: <d.d>
} 
```

##### Examples

``` 
// Returns: { latitude: 0, longitude: 0 }
new GeoCoord(0, 0).toDecimal();

// Returns: { latitude: 60.170833333333334, longitude: 24.9375 }
new GeoCoord(
  { degrees: 60, minutes: 10, seconds: 15, hemisphere: "N" },
  { degrees: 24, minutes: 56, seconds: 15, hemisphere: "E" }
).toDecimal();
```

#### toDMS()

``` 
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

``` 
const {
  latitudeToDecimal,
  latitudeToDMS,
  longitudeToDecimal,
  longitudeToDMS,
} = require("geo-coord");

```

#### latitudeToDecimal(degrees, minutes, seconds, hemisphere)

Converts the given latitude coordinate from degrees, minutes, seconds, and hemisphere ("N" or "S") to its decimal representation. The result will be positive for the northern hemisphere, and negative for the southern hemisphere.

The validity of the parameters will be checked, and any values outside of their range will result in an error thrown:

* degrees: [0..90]
* minutes: [0..60[
* seconds: [0..60[
* hemisphere: "N" or "S"
* result: [-90..90]

##### Examples

``` 
// Returns: 0
latitudeToDecimal(0, 0, 0, "N"); 

// Returns: -0
latitudeToDecimal(0, 0, 0, "S"); 

// Returns: 60.5
latitudeToDecimal(60, 30, 0, "N"); 

// Returns: -20.26
latitudeToDecimal(20, 15, 36, "S"); 

```

#### latitudeToDMS(decimalDegrees)

Converts the given latitude coordinates from decimal degrees to degrees, minutes, seconds, and hemisphere. The decimal degrees are expected to be negative for the souther hemisphere, and positive for the northern hemisphere.

The validity of the parameter will be checked, and any value outside of its range will result in an error throw:

* decimalDegrees: [-90..90]

##### Examples

``` 
// Returns: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "N" }
latitudeToDMS(0); 

// Returns: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "S" }
latitudeToDMS(-0); 

// Returns: { degrees: 60, minutes: 30, seconds: 0, hemisphere: "N" }
latitudeToDMS(60.5); 

// Returns: { degrees: 20, minutes: 15, seconds: 36, hemisphere: "S" }
latitudeToDMS(-20.26); 

```

#### longitudeToDecimal(degrees, minutes, seconds, hemisphere)

Converts the given longitude coordinate from degrees, minutes, seconds, and hemisphere ("E" or "W") to its decimal representation. The result will be positive for the eatern hemisphere, and negative for the western hemisphere.

The validity of the parameters will be checked, and any values outside of their range will result in an error thrown:

* degrees: [0..180]
* minutes: [0..60[
* seconds: [0..60[
* hemisphere: "E" or "W"
* result: [-180..180]

##### Examples

``` 
// Returns: 0
longitudeToDecimal(0, 0, 0, "E"); 

// Returns: -0
longitudeToDecimal(0, 0, 0, "W"); 

// Returns: 60.5
longitudeToDecimal(60, 30, 0, "E"); 

// Returns: -20.26
longitudeToDecimal(20, 15, 36, "W"); 

```

#### longitudeToDMS(decimalDegrees)

Converts the given longitude coordinates from decimal degrees to degrees, minutes, seconds, and hemisphere. The decimal degrees are expected to be negative for the western hemisphere, and positive for the eastern hemisphere.

The validity of the parameter will be checked, and any value outside of its range will result in an error throw:

* decimalDegrees: [-180..180]

##### Examples

``` 
// Returns: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "E" }
longitudeToDMS(0); 

// Returns: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "W" }
longitudeToDMS(-0); 

// Returns: { degrees: 60, minutes: 30, seconds: 0, hemisphere: "E" }
longitudeToDMS(60.5); 

// Returns: { degrees: 20, minutes: 15, seconds: 36, hemisphere: "W" }
longitudeToDMS(-20.26); 
```

## Roadmap

The goal with the library is to become a more comprehensive library for any calculations and manipulations of geological coordinates.

Planned features:

* Convert from (fully or partially) decimal to degrees, minutes, seconds, and hemisphere
* Full coordinate conversions (latitude + longitude)
* Formatting to textual presentation
* Parsing from textual presentation
* Distance between coordinates
