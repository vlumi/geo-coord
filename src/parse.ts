import parseInput from "./geo-coord/parse-input/index.js";
import parseString from "./geo-coord/parse-input/parse-string.js";
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

export interface ParseOptions {
  /**
   * Hemisphere words in the caller's language, mapped to N, S, E or W — the
   * same table `formatCoordinates` takes as `hemispheres`, inverted:
   * `{ 北緯: "N", 南緯: "S", 東経: "E", 西経: "W" }`. Matched whole and
   * case-insensitively. English letters and words are always understood.
   */
  hemispheres?: Readonly<Record<string, "N" | "S" | "E" | "W">>;
}

/**
 * A parser that also understands the caller's hemisphere words. The returned
 * `parse` and `tryParse` take a string; everything else `parseCoordinates`
 * accepts is language-independent and needs no options.
 */
export const createParser = (options: ParseOptions = {}) => {
  const parse = (input: string): Coordinates => {
    const sink = { latitude: 0, longitude: 0 };
    parseString(sink, input, options.hemispheres);
    return sink;
  };
  const tryParse = (input: string): Coordinates | null => {
    try {
      return parse(input);
    } catch {
      return null;
    }
  };
  return { parse, tryParse };
};
