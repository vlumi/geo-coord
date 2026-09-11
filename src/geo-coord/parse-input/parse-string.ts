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

export default (that: CoordSink, input: string): void => {
  const uri = geoURI.exec(input.trim());
  if (uri) {
    parseValues(that, Number(uri[1]), Number(uri[2]));
    return;
  }
  const splitInput: (number | string)[] = input
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
    throw new Error(`Invalid arguments: ${JSON.stringify(input)} (${detail})`);
  }
};
