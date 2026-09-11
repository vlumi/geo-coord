import parseValues from "./parse-values.js";
import type { CoordSink } from "../../types.js";

const splitter = /[^-\dNSEW.]+/;
/** A hemisphere letter glued to its number, either side: "N35.68", "139.77E". */
const glued = /^(?:([NSEW])(-?\d+(?:\.\d+)?)|(-?\d+(?:\.\d+)?)([NSEW]))$/;

const toValue = (token: string): number | string => {
  const n = Number(token);
  return Number.isNaN(n) ? token : n;
};

/** RFC 5870 geo URI: `geo:lat,lon[,altitude][;params]`. Only the two coordinates matter here. */
const geoURI = /^geo:\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)(?:\s*,\s*-?\d+(?:\.\d+)?)?\s*(?:;.*)?$/i;

/** The English hemisphere words; other languages come from the caller via `createParser`. */
const ENGLISH_WORDS: Readonly<Record<string, string>> = { north: "N", south: "S", east: "E", west: "W" };

const escape = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** A lone hemisphere letter in either case, not part of a longer word: "n35.68", "33.87 s". */
const loneLetter = /(?<![\p{L}])[nsew](?![\p{L}])/giu;

/**
 * Hemisphere marks as people actually type them — lowercase letters, the
 * English words, and any words the caller supplies — become the capital
 * letters the tokenizer reads. Without this a lowercase "s" was a separator
 * and the sign silently flipped.
 */
export const normalizeHemispheres = (
  input: string,
  words: Readonly<Record<string, string>> = {},
): string => {
  const table: Record<string, string> = {};
  for (const [word, letter] of Object.entries({ ...ENGLISH_WORDS, ...words })) {
    table[word.toLowerCase()] = letter.toUpperCase();
  }
  const keys = Object.keys(table).sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`(?<![\\p{L}])(${keys.map(escape).join("|")})(?![\\p{L}])`, "giu");
  return input
    .replace(pattern, (word) => table[word.toLowerCase()] ?? word)
    .replace(loneLetter, (letter) => letter.toUpperCase());
};

export default (that: CoordSink, input: string, words?: Readonly<Record<string, string>>): void => {
  const uri = geoURI.exec(input.trim());
  if (uri) {
    parseValues(that, Number(uri[1]), Number(uri[2]));
    return;
  }
  const splitInput: (number | string)[] = normalizeHemispheres(input, words)
    .split(splitter)
    .filter((value) => value !== "")
    .flatMap((token) => {
      const m = glued.exec(token);
      if (!m) return [toValue(token)];
      // Keep the letter on the side it was written: "N35" leads, "35N" trails.
      return m[1] !== undefined ? [m[1], Number(m[2])] : [Number(m[3]), m[4] as string];
    });
  // Errors name the text as typed, not the tokens it fell apart into — which
  // for "Tokyo" is nothing at all.
  if (splitInput.length === 0) {
    throw new Error(`Invalid arguments: no coordinates in ${JSON.stringify(input)}`);
  }
  try {
    parseValues(that, ...splitInput);
  } catch (e) {
    const detail = e instanceof Error ? e.message.replace(/^Invalid arguments: /, "") : String(e);
    throw new Error(`Invalid arguments: ${JSON.stringify(input)} (${detail})`, { cause: e });
  }
};
