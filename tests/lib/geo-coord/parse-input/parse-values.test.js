const parseValues = require("../../../../lib/geo-coord/parse-input/parse-values");

describe("Parse values", () => {
  describe("2 DD values", () => {
    test("(0, 0)", () => {
      const that = { latitude: undefined, longitude: undefined };
      parseValues(that, 0, 0);
      expect(that.latitude).toBe(0);
      expect(that.longitude).toBe(0);
    });
    test("(1, 2)", () => {
      const that = { latitude: undefined, longitude: undefined };
      parseValues(that, 1, 2);
      expect(that.latitude).toBe(1);
      expect(that.longitude).toBe(2);
    });
    test("(-90, 180)", () => {
      const that = { latitude: undefined, longitude: undefined };
      parseValues(that, -90, 180);
      expect(that.latitude).toBe(-90);
      expect(that.longitude).toBe(180);
    });
    describe("Invalid", () => {
      test("(-91, 180)", () =>
        expect(() => parseValues(undefined, -91, 180)).toThrow());
      test("(-90.1, 180)", () =>
        expect(() => parseValues(undefined, -90.1, 180)).toThrow());
      test("(-90, 181)", () =>
        expect(() => parseValues(undefined, -90, 181)).toThrow());
      test("(-90, 180.1)", () =>
        expect(() => parseValues(undefined, -90, 180.1)).toThrow());
    });
  });
  describe("4 DMS value parts", () => {
    test("(0, N, 0, E)", () => {
      const that = { latitude: undefined, longitude: undefined };
      parseValues(that, 0, "N", 0, "E");
      expect(that.latitude).toBe(0);
      expect(that.longitude).toBe(0);
    });
    test("(1, N, 2, E)", () => {
      const that = { latitude: undefined, longitude: undefined };
      parseValues(that, 1, "N", 2, "E");
      expect(that.latitude).toBe(1);
      expect(that.longitude).toBe(2);
    });
    test("(1, S, 2, W)", () => {
      const that = { latitude: undefined, longitude: undefined };
      parseValues(that, 1, "S", 2, "W");
      expect(that.latitude).toBe(-1);
      expect(that.longitude).toBe(-2);
    });
    test("(90, S, 180, E)", () => {
      const that = { latitude: undefined, longitude: undefined };
      parseValues(that, 90, "S", 180, "E");
      expect(that.latitude).toBe(-90);
      expect(that.longitude).toBe(180);
    });
    describe("Invalid", () => {
      test("(91, S, 180, E)", () =>
        expect(() => parseValues(undefined, 91, "S", 180, "E")).toThrow());
      test("(90, S, 181, E)", () =>
        expect(() => parseValues(undefined, 90, "S", 181, "E")).toThrow());
    });
  });
  describe("5 DMS value parts", () => {
    test("(0, 0, N, 0, E)", () => {
      const that = { latitude: undefined, longitude: undefined };
      parseValues(that, 0, 0, "N", 0, "E");
      expect(that.latitude).toBe(0);
      expect(that.longitude).toBe(0);
    });
    test("(0, N, 0, 0, E)", () => {
      const that = { latitude: undefined, longitude: undefined };
      parseValues(that, 0, "N", 0, 0, "E");
      expect(that.latitude).toBe(0);
      expect(that.longitude).toBe(0);
    });
    test("(1, 30, N, 2, E)", () => {
      const that = { latitude: undefined, longitude: undefined };
      parseValues(that, 1, 30, "N", 2, "E");
      expect(that.latitude).toBe(1.5);
      expect(that.longitude).toBe(2);
    });
    test("(1, N, 2, 30, E)", () => {
      const that = { latitude: undefined, longitude: undefined };
      parseValues(that, 1, "N", 2, 30, "E");
      expect(that.latitude).toBe(1);
      expect(that.longitude).toBe(2.5);
    });
    describe("Invalid", () => {
      test("(90, 1, S, 180, E)", () =>
        expect(() => parseValues(undefined, 90, 1, "S", 180, "E")).toThrow());
      test("(90, S, 180, 1, E)", () =>
        expect(() => parseValues(undefined, 90, "S", 180, 1, "E")).toThrow());
    });
  });
  describe("6 DMS value parts", () => {
    test("(0, 0, N, 0, 0, E)", () => {
      const that = { latitude: undefined, longitude: undefined };
      parseValues(that, 0, 0, "N", 0, 0, "E");
      expect(that.latitude).toBe(0);
      expect(that.longitude).toBe(0);
    });
    test("(0, N, 0, 0, 0, E)", () => {
      const that = { latitude: undefined, longitude: undefined };
      parseValues(that, 0, "N", 0, 0, 0, "E");
      expect(that.latitude).toBe(0);
      expect(that.longitude).toBe(0);
    });
    test("(0, 0, 0, N, 0, E)", () => {
      const that = { latitude: undefined, longitude: undefined };
      parseValues(that, 0, 0, 0, "N", 0, "E");
      expect(that.latitude).toBe(0);
      expect(that.longitude).toBe(0);
    });
    test("(1, 30, N, 2, 15, E)", () => {
      const that = { latitude: undefined, longitude: undefined };
      parseValues(that, 1, 30, "N", 2, 15, "E");
      expect(that.latitude).toBe(1.5);
      expect(that.longitude).toBe(2.25);
    });
    test("(1, N, 2, 30, 36, E)", () => {
      const that = { latitude: undefined, longitude: undefined };
      parseValues(that, 1, "N", 2, 30, 36, "E");
      expect(that.latitude).toBe(1);
      expect(that.longitude).toBe(2.51);
    });
    test("(1, 30, 36, N, 2, E)", () => {
      const that = { latitude: undefined, longitude: undefined };
      parseValues(that, 1, 30, 36, "N", 2, "E");
      expect(that.latitude).toBe(1.51);
      expect(that.longitude).toBe(2);
    });
    describe("Invalid", () => {
      test("(90, 1, S, 180, 0, E)", () =>
        expect(() =>
          parseValues(undefined, 90, 1, "S", 180, 0, "E")
        ).toThrow());
      test("(90, 0, S, 180, 1,  E)", () =>
        expect(() =>
          parseValues(undefined, 90, 0, "S", 180, 1, "E")
        ).toThrow());
    });
  });
  describe("7 DMS value parts", () => {
    test("(0, 0, 0, N, 0, 0, E)", () => {
      const that = { latitude: undefined, longitude: undefined };
      parseValues(that, 0, 0, 0, "N", 0, 0, "E");
      expect(that.latitude).toBe(0);
      expect(that.longitude).toBe(0);
    });
    test("(0, 0, N, 0, 0, 0, E)", () => {
      const that = { latitude: undefined, longitude: undefined };
      parseValues(that, 0, 0, "N", 0, 0, 0, "E");
      expect(that.latitude).toBe(0);
      expect(that.longitude).toBe(0);
    });
    test("(1, 30, 36, N, 2, 15, W)", () => {
      const that = { latitude: undefined, longitude: undefined };
      parseValues(that, 1, 30, 36, "N", 2, 15, "W");
      expect(that.latitude).toBe(1.51);
      expect(that.longitude).toBe(-2.25);
    });
    test("(1, 15, S, 2, 30, 36, E)", () => {
      const that = { latitude: undefined, longitude: undefined };
      parseValues(that, 1, 15, "S", 2, 30, 36, "E");
      expect(that.latitude).toBe(-1.25);
      expect(that.longitude).toBe(2.51);
    });
    describe("Invalid", () => {
      test("(90, 0, 1, S, 180, 0, E)", () =>
        expect(() =>
          parseValues(undefined, 90, 0, 1, "S", 180, 0, "E")
        ).toThrow());
      test("(90, 0, S, 180, 0, 1, E)", () =>
        expect(() =>
          parseValues(undefined, 90, 0, "S", 180, 0, 1, "E")
        ).toThrow());
    });
  });
  describe("8 DMS value parts", () => {
    test("(0, 0, 0, N, 0, 0, 0, E)", () => {
      const that = { latitude: undefined, longitude: undefined };
      parseValues(that, 0, 0, 0, "N", 0, 0, 0, "E");
      expect(that.latitude).toBe(0);
      expect(that.longitude).toBe(0);
    });
    test("(50, 15, 36, S, 20, 45, 36, W)", () => {
      const that = { latitude: undefined, longitude: undefined };
      parseValues(that, 50, 15, 36, "S", 20, 45, 36, "W");
      expect(that.latitude).toBe(-50.26);
      expect(that.longitude).toBe(-20.76);
    });
    describe("Invalid", () => {
      test("(0, 0, 0, E, 0, 0, 0, S)", () =>
        expect(() =>
          parseValues(undefined, 0, 0, 0, "E", 0, 0, 0, "S")
        ).toThrow());
      test("(0, 0, 0, X, 0, 0, 0, X)", () =>
        expect(() =>
          parseValues(undefined, 0, 0, 0, "X", 0, 0, 0, "X")
        ).toThrow());
      test("(90, 0, 1, S, 180, 0, 0, E)", () =>
        expect(() =>
          parseValues(undefined, 90, 0, 1, "S", 180, 0, 0, "E")
        ).toThrow());
      test("(90, 1, 0, S, 180, 0, 0, E)", () =>
        expect(() =>
          parseValues(undefined, 90, 1, 0, "S", 180, 0, 0, "E")
        ).toThrow());
      test("(91, 0, 0, S, 180, 0, 0, E)", () =>
        expect(() =>
          parseValues(undefined, 91, 0, 0, "S", 180, 0, 0, "E")
        ).toThrow());
      test("(90, 0, 0, S, 180, 0, 1, E)", () =>
        expect(() =>
          parseValues(undefined, 90, 0, 0, "S", 180, 0, 1, "E")
        ).toThrow());
      test("(90, 0, 0, S, 180, 1, 0, E)", () =>
        expect(() =>
          parseValues(undefined, 90, 0, 0, "S", 180, 1, 0, "E")
        ).toThrow());
      test("(90, 0, 0, S, 181, 0, 0, E)", () =>
        expect(() =>
          parseValues(undefined, 90, 0, 0, "S", 181, 0, 0, "E")
        ).toThrow());
    });
  });
});
