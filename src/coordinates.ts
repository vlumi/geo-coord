import type { Coordinates, LonLat } from "./types.js";

/** `{ latitude, longitude }` from a GeoJSON-style `[longitude, latitude]` tuple. */
export const fromLonLat = ([longitude, latitude]: LonLat): Coordinates => ({
  latitude,
  longitude,
});

/** A GeoJSON-style `[longitude, latitude]` tuple from `{ latitude, longitude }`. */
export const toLonLat = ({ latitude, longitude }: Coordinates): LonLat => [
  longitude,
  latitude,
];

/** Whether a latitude is a finite number within ±90°. */
export const isValidLatitude = (latitude: number): boolean =>
  Number.isFinite(latitude) && latitude >= -90 && latitude <= 90;

/** Whether a longitude is a finite number within ±180°. */
export const isValidLongitude = (longitude: number): boolean =>
  Number.isFinite(longitude) && longitude >= -180 && longitude <= 180;
