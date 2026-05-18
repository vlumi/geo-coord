import parseObject from "./parse-object.js";
import parseString from "./parse-string.js";
import parseValues from "./parse-values.js";
import type { CoordSink } from "../../types.js";

export default (that: CoordSink, ...input: unknown[]): void => {
  switch (input.length) {
    case 1: {
      const [a] = input;
      if (typeof a === "string") {
        parseString(that, a);
      } else if (typeof a === "object") {
        parseObject(that, a);
      } else {
        throw new Error(`Invalid arguments: ${String(input)}`);
      }
      break;
    }
    case 2: {
      const [a, b] = input;
      if (typeof a === "object" && typeof b === "object") {
        parseObject(that, { latitude: a, longitude: b });
      } else {
        parseValues(that, ...input);
      }
      break;
    }
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
      parseValues(that, ...input);
      break;
    default:
      throw new Error(`Invalid arguments: ${String(input)}`);
  }
};
