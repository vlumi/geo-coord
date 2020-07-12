const parseInput = require("../../../../lib/geo-coord/parse-input");

jest.mock("../../../../lib/geo-coord/parse-input/parse-string");
const parseString = require("../../../../lib/geo-coord/parse-input/parse-string");
parseString.mockImplementation(() => {});

jest.mock("../../../../lib/geo-coord/parse-input/parse-object");
const parseObject = require("../../../../lib/geo-coord/parse-input/parse-object");
parseObject.mockImplementation(() => {});

jest.mock("../../../../lib/geo-coord/parse-input/parse-values");
const parseValues = require("../../../../lib/geo-coord/parse-input/parse-values");
parseValues.mockImplementation(() => {});

jest.mock();

describe("Parse input", () => {
  describe("String", () => {
    test("Input with one empty string", () => {
      parseInput(undefined, "");
      expect(parseString).toHaveBeenCalled();
    });
  });
  describe("Object", () => {
    test("Input with one empty object", () => {
      parseInput(undefined, {});
      expect(parseObject).toHaveBeenCalled();
    });
    test("Input with two empty objects", () => {
      parseInput(undefined, {}, {});
      expect(parseObject).toHaveBeenCalled();
    });
  });
  describe("Values", () => {
    test("2 parameters", () => {
      parseInput(undefined, 0, 0);
      expect(parseObject).toHaveBeenCalled();
    });
    test("4 parameters", () => {
      parseInput(undefined, 0, "N", 0, "E");
      expect(parseObject).toHaveBeenCalled();
    });
    test("5 parameters", () => {
      parseInput(undefined, 0, 0, "N", 0, "E");
      expect(parseObject).toHaveBeenCalled();
    });
    test("6 parameters", () => {
      parseInput(undefined, 0, 0, "N", 0, 0, "E");
      expect(parseObject).toHaveBeenCalled();
    });
    test("7 parameters", () => {
      parseInput(undefined, 0, 0, 0, "N", 0, 0, "E");
      expect(parseObject).toHaveBeenCalled();
    });
    test("8 parameters", () => {
      parseInput(undefined, 0, 0, 0, "N", 0, 0, 0, "E");
      expect(parseObject).toHaveBeenCalled();
    });
  });
  describe("Invalid", () => {
    test("Undefined", () => {
      expect(() => parseInput(undefined, undefined)).toThrow();
    });
    test("No parametrs", () => {
      expect(() => parseInput(undefined)).toThrow();
    });
    test("1 number", () => {
      expect(() => parseInput(undefined, 0)).toThrow();
    });
    test("3 parameters", () => {
      expect(() => parseInput(undefined, 0, 0, 0)).toThrow();
    });
    test("9 parameters", () => {
      expect(() => parseInput(undefined, 0, 0, 0, 0, 0, 0, 0, 0, 0)).toThrow();
    });
  });
});
