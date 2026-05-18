import parseValues from "./parse-values.js";
import type { CoordSink } from "../../types.js";

const splitter = /[^-\dNSEW.]+/;

export default (that: CoordSink, input: string): void => {
  const splitInput: (number | string)[] = input
    .split(splitter)
    .filter((value) => value !== "")
    .map((value) => {
      const n = Number(value);
      return Number.isNaN(n) ? value : n;
    });
  parseValues(that, ...splitInput);
};
