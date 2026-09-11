export type LatitudeHemisphere = "N" | "S";
export type LongitudeHemisphere = "E" | "W";
export type Hemisphere = LatitudeHemisphere | LongitudeHemisphere;

export interface DMS<H extends Hemisphere = Hemisphere> {
  degrees: number;
  minutes: number;
  seconds: number;
  hemisphere: H;
}

export interface DDCoordinates {
  latitude: number;
  longitude: number;
}

/** A point as `{ latitude, longitude }` in decimal degrees. The name every function here takes and returns. */
export type Coordinates = DDCoordinates;

/** A point as `[longitude, latitude]`, the order GeoJSON, MapLibre and deck.gl use. */
export type LonLat = [longitude: number, latitude: number];

export interface DMSCoordinates {
  latitude: DMS<LatitudeHemisphere>;
  longitude: DMS<LongitudeHemisphere>;
}

export interface CoordSink {
  latitude: number;
  longitude: number;
}

/**
 * A latitude/longitude box. `west` greater than `east` means the box wraps the antimeridian;
 * `west` -180 and `east` 180 means all longitudes.
 */
export interface BoundingBox {
  south: number;
  west: number;
  north: number;
  east: number;
}
