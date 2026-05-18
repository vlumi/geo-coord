import { describe, expect, test, vi } from "vitest";

vi.mock("../../../src/geo-coord/parse-input/parse-string.js", () => ({
  default: vi.fn(),
}));
vi.mock("../../../src/geo-coord/parse-input/parse-object.js", () => ({
  default: vi.fn(),
}));
vi.mock("../../../src/geo-coord/parse-input/parse-values.js", () => ({
  default: vi.fn(),
}));

import parseInput from "../../../src/geo-coord/parse-input/index.js";
import parseString from "../../../src/geo-coord/parse-input/parse-string.js";
import parseObject from "../../../src/geo-coord/parse-input/parse-object.js";

const sink = () => ({ latitude: 0, longitude: 0 });

describe("Parse input", () => {
  describe("String", () => {
    test("Input with one empty string", () => {
      parseInput(sink(), "");
      expect(parseString).toHaveBeenCalled();
    });
  });
  describe("Object", () => {
    test("Input with one empty object", () => {
      parseInput(sink(), {});
      expect(parseObject).toHaveBeenCalled();
    });
    test("Input with two empty objects", () => {
      parseInput(sink(), {}, {});
      expect(parseObject).toHaveBeenCalled();
    });
  });
  describe("Values", () => {
    test("2 parameters", () => {
      parseInput(sink(), 0, 0);
      expect(parseObject).toHaveBeenCalled();
    });
    test("4 parameters", () => {
      parseInput(sink(), 0, "N", 0, "E");
      expect(parseObject).toHaveBeenCalled();
    });
    test("5 parameters", () => {
      parseInput(sink(), 0, 0, "N", 0, "E");
      expect(parseObject).toHaveBeenCalled();
    });
    test("6 parameters", () => {
      parseInput(sink(), 0, 0, "N", 0, 0, "E");
      expect(parseObject).toHaveBeenCalled();
    });
    test("7 parameters", () => {
      parseInput(sink(), 0, 0, 0, "N", 0, 0, "E");
      expect(parseObject).toHaveBeenCalled();
    });
    test("8 parameters", () => {
      parseInput(sink(), 0, 0, 0, "N", 0, 0, 0, "E");
      expect(parseObject).toHaveBeenCalled();
    });
  });
  describe("Invalid", () => {
    test("Undefined", () => {
      expect(() => parseInput(sink(), undefined)).toThrow();
    });
    test("No parametrs", () => {
      expect(() => parseInput(sink())).toThrow();
    });
    test("1 number", () => {
      expect(() => parseInput(sink(), 0)).toThrow();
    });
    test("3 parameters", () => {
      expect(() => parseInput(sink(), 0, 0, 0)).toThrow();
    });
    test("9 parameters", () => {
      expect(() => parseInput(sink(), 0, 0, 0, 0, 0, 0, 0, 0, 0)).toThrow();
    });
  });
});
