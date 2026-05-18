import type { DMS, LatitudeHemisphere, LongitudeHemisphere } from "./types.js";

const LATITUDE_HEMISPHERES: readonly string[] = ["N", "S"];
const LONGITUDE_HEMISPHERES: readonly string[] = ["E", "W"];

export const latitudeToDD = (
  degrees: number,
  minutes: number,
  seconds: number,
  hemisphere: string,
): number => {
  if (!LATITUDE_HEMISPHERES.includes(hemisphere)) {
    throw new Error(`Invalid latitude hemisphere value: ${hemisphere}`);
  }
  if (degrees < 0 || degrees > 90) {
    throw new Error(`Latitude degrees outside of range: ${degrees}`);
  }
  if (minutes < 0 || minutes >= 60) {
    throw new Error(`Latitude minutes outside of range: ${minutes}`);
  }
  if (seconds < 0 || seconds >= 60) {
    throw new Error(`Latitude minutes outside of range: ${minutes}`);
  }
  if (degrees === 90 && (minutes > 0 || seconds > 0)) {
    throw new Error(
      `Latitude exceeds 90 degrees: ${degrees}° ${minutes}′ ${seconds}″ ${hemisphere}`,
    );
  }
  return convertToDD(degrees, minutes, seconds, hemisphere === "S");
};

export const latitudeToDMS = (dd: number): DMS<LatitudeHemisphere> => {
  if (dd < -90 || dd > 90) {
    throw new Error(`Invalid longitude: ${dd}`);
  }
  const sign = Math.sign(dd);
  const absDegrees = Math.abs(dd);
  const degrees = Math.floor(round(absDegrees));
  const minutes = Math.floor(round(60 * (absDegrees - degrees)));
  const seconds = round(3600 * (absDegrees - degrees) - 60 * minutes);
  const hemisphere: LatitudeHemisphere =
    Object.is(sign, 0) || sign > 0 ? "N" : "S";
  return { degrees, minutes, seconds, hemisphere };
};

export const longitudeToDD = (
  degrees: number,
  minutes: number,
  seconds: number,
  hemisphere: string,
): number => {
  if (!LONGITUDE_HEMISPHERES.includes(hemisphere)) {
    throw new Error(`Invalid longitude hemisphere value: ${hemisphere}`);
  }
  if (degrees < 0 || degrees > 180) {
    throw new Error(`Longitude degrees outside of range: ${degrees}`);
  }
  if (minutes < 0 || minutes >= 60) {
    throw new Error(`Longitude minutes outside of range: ${minutes}`);
  }
  if (seconds < 0 || seconds >= 60) {
    throw new Error(`Longitude seconds outside of range: ${seconds}`);
  }
  if (degrees === 180 && (minutes > 0 || seconds > 0)) {
    throw new Error(
      `Longitude exceeds 180 degrees: ${degrees}° ${minutes}′ ${seconds}″ ${hemisphere}`,
    );
  }
  return convertToDD(degrees, minutes, seconds, hemisphere === "W");
};

export const longitudeToDMS = (dd: number): DMS<LongitudeHemisphere> => {
  if (dd < -180 || dd > 180) {
    throw new Error(`Invalid longitude: ${dd}`);
  }
  const sign = Math.sign(dd);
  const absDegrees = Math.abs(dd);
  const degrees = Math.floor(round(absDegrees));
  const minutes = Math.abs(Math.floor(round(60 * (absDegrees - degrees))));
  const seconds = Math.abs(round(3600 * (absDegrees - degrees) - 60 * minutes));
  const hemisphere: LongitudeHemisphere =
    Object.is(sign, 0) || sign > 0 ? "E" : "W";
  return { degrees, minutes, seconds, hemisphere };
};

const round = (num: number): number => {
  const PRECISION = 10 ** 9;
  return Math.round(num * PRECISION) / PRECISION;
};

const convertToDD = (
  degrees: number,
  minutes: number,
  seconds: number,
  negative: boolean,
): number => {
  return (negative ? -1 : 1) * (degrees + minutes / 60 + seconds / 3600);
};
