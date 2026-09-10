import { normalizeLongitude } from "./longitude.js";
import type { DDCoordinates } from "./types.js";

/** IUGG mean Earth radius, the conventional sphere for great-circle work. */
export const MEAN_EARTH_RADIUS_KM = 6371.0088;

export interface GeodesyOptions {
  /** Sphere radius the distances are measured on; defaults to `MEAN_EARTH_RADIUS_KM`. */
  radiusKm?: number;
}

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

const radius = ({ radiusKm = MEAN_EARTH_RADIUS_KM }: GeodesyOptions): number =>
  radiusKm;

/** Central angle between two points, in radians (haversine). */
const angularDistance = (from: DDCoordinates, to: DDCoordinates): number => {
  const φ1 = from.latitude * RAD;
  const φ2 = to.latitude * RAD;
  const Δφ = φ2 - φ1;
  const Δλ = (to.longitude - from.longitude) * RAD;
  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/** Great-circle distance between two points, in kilometres. */
export const distanceKm = (
  from: DDCoordinates,
  to: DDCoordinates,
  options: GeodesyOptions = {},
): number => angularDistance(from, to) * radius(options);

/** Bearing at `from` towards `to`, clockwise from north in [0, 360). */
export const initialBearing = (
  from: DDCoordinates,
  to: DDCoordinates,
): number => {
  const φ1 = from.latitude * RAD;
  const φ2 = to.latitude * RAD;
  const Δλ = (to.longitude - from.longitude) * RAD;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (Math.atan2(y, x) * DEG + 360) % 360;
};

/** Bearing on arrival at `to`, clockwise from north in [0, 360). */
export const finalBearing = (from: DDCoordinates, to: DDCoordinates): number =>
  (initialBearing(to, from) + 180) % 360;

/** The point `distance` kilometres along the great circle leaving `from` on `bearing` degrees. */
export const destination = (
  from: DDCoordinates,
  bearing: number,
  distance: number,
  options: GeodesyOptions = {},
): DDCoordinates => {
  const δ = distance / radius(options);
  const θ = bearing * RAD;
  const φ1 = from.latitude * RAD;
  const φ2 = Math.asin(
    Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ),
  );
  const Δλ = Math.atan2(
    Math.sin(θ) * Math.sin(δ) * Math.cos(φ1),
    Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2),
  );
  return {
    latitude: φ2 * DEG,
    longitude: normalizeLongitude(from.longitude + Δλ * DEG),
  };
};

/**
 * The point `fraction` of the way from `from` to `to` along the great circle: 0 is `from`, 1 is `to`,
 * values outside [0, 1] extrapolate.
 */
export const interpolate = (
  from: DDCoordinates,
  to: DDCoordinates,
  fraction: number,
): DDCoordinates => {
  const δ = angularDistance(from, to);
  if (δ === 0) {
    return { latitude: from.latitude, longitude: from.longitude };
  }
  const φ1 = from.latitude * RAD;
  const λ1 = from.longitude * RAD;
  const φ2 = to.latitude * RAD;
  const λ2 = to.longitude * RAD;
  const a = Math.sin((1 - fraction) * δ) / Math.sin(δ);
  const b = Math.sin(fraction * δ) / Math.sin(δ);
  const x = a * Math.cos(φ1) * Math.cos(λ1) + b * Math.cos(φ2) * Math.cos(λ2);
  const y = a * Math.cos(φ1) * Math.sin(λ1) + b * Math.cos(φ2) * Math.sin(λ2);
  const z = a * Math.sin(φ1) + b * Math.sin(φ2);
  return {
    latitude: Math.atan2(z, Math.hypot(x, y)) * DEG,
    longitude: normalizeLongitude(Math.atan2(y, x) * DEG),
  };
};

/** The point halfway along the great circle between two points. */
export const midpoint = (from: DDCoordinates, to: DDCoordinates): DDCoordinates =>
  interpolate(from, to, 0.5);
