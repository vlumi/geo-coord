import parseValues from "./parse-values.js";
import type { CoordSink } from "../../types.js";

const splitter = /[^-\dNSEW.]+/;
/** A hemisphere letter glued to its number, either side: "N35.68", "139.77E". */
const glued = /^(?:([NSEW])(-?\d+(?:\.\d+)?)|(-?\d+(?:\.\d+)?)([NSEW]))$/;

const toValue = (token: string): number | string => {
  const n = Number(token);
  return Number.isNaN(n) ? token : n;
};

export default (that: CoordSink, input: string): void => {
  const splitInput: (number | string)[] = input
    .split(splitter)
    .filter((value) => value !== "")
    .flatMap((token) => {
      const m = glued.exec(token);
      if (!m) return [toValue(token)];
      // Keep the letter on the side it was written: "N35" leads, "35N" trails.
      return m[1] !== undefined ? [m[1], Number(m[2])] : [Number(m[3]), m[4] as string];
    });
  parseValues(that, ...splitInput);
};
