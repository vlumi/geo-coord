import parseInput from "./geo-coord/parse-input/index.js";
import type { Coordinates } from "./types.js";

/**
 * Coordinates from anything the parser understands: a string in any common
 * notation (decimal, DMS, hemisphere letters before or after, geo URIs), a
 * `{ latitude, longitude }` object in decimal degrees or DMS parts, or the
 * separate values `GeoCoord` accepts. Throws on input it cannot read.
 */
export const parseCoordinates = (...input: unknown[]): Coordinates => {
  const sink = { latitude: 0, longitude: 0 };
  parseInput(sink, ...input);
  return sink;
};

/** Like `parseCoordinates`, but `null` instead of an exception for input it cannot read. */
export const tryParseCoordinates = (...input: unknown[]): Coordinates | null => {
  try {
    return parseCoordinates(...input);
  } catch {
    return null;
  }
};
