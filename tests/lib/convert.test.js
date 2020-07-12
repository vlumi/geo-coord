const {
  latitudeToDecimal,
  latitudeToDMSH,
  longitudeToDecimal,
  longitudeToDMSH,
} = require("../../lib/convert");

describe("Latitude to decimal", () => {
  describe("Extremes", () => {
    test("0° 0′ 0″ N", () => expect(latitudeToDecimal(0, 0, 0, "N")).toBe(0));
    test("0° 0′ 0″ S", () => expect(latitudeToDecimal(0, 0, 0, "S")).toBe(-0));
    test("90° 0′ 0″ N", () =>
      expect(latitudeToDecimal(90, 0, 0, "N")).toBe(90));
    test("90° 0′ 0″ S", () =>
      expect(latitudeToDecimal(90, 0, 0, "S")).toBe(-90));
  });

  describe("Excess", () => {
    test("91° 0′ 0″ N", () =>
      expect(() => latitudeToDecimal(91, 0, 0, "N")).toThrow());
    test("91° 0′ 0″ N", () =>
      expect(() => latitudeToDecimal(91, 0, 0, "S")).toThrow());
    test("0° 60′ 0″ N", () =>
      expect(() => latitudeToDecimal(0, 60, 0, "N")).toThrow());
    test("0° 60′ 0″ N", () =>
      expect(() => latitudeToDecimal(0, 60, 0, "S")).toThrow());
    test("0° 0′ 60″ N", () =>
      expect(() => latitudeToDecimal(0, 0, 60, "N")).toThrow());
    test("0° 0′ 60″ N", () =>
      expect(() => latitudeToDecimal(0, 0, 60, "S")).toThrow());
    test("90° 0′ 0.1″ N", () =>
      expect(() => latitudeToDecimal(90, 0, 0.1, "N")).toThrow());
    test("90° 0′ 0.1″ N", () =>
      expect(() => latitudeToDecimal(90, 0, 0.1, "S")).toThrow());
  });
  describe("Examples", () => {
    test("10° 15′ 0″ N", () =>
      expect(latitudeToDecimal(10, 15, 0, "N")).toBe(10.25));
    test("50° 30.6′ 0″ N", () =>
      expect(latitudeToDecimal(50, 30.6, 0, "N")).toBe(50.51));
    test("50° 30′ 36″ S", () =>
      expect(latitudeToDecimal(50, 30.6, 0, "S")).toBe(-50.51));
    test("15.1234° 0′ 0″ S", () =>
      expect(latitudeToDecimal(15.1234, 0, 0, "S")).toBe(-15.1234));
    test("60° 10′ 15″ N", () =>
      expect(latitudeToDecimal(60, 10, 48, "N")).toBe(60.18));
    test("60° 30′ 0″ N", () =>
      expect(latitudeToDecimal(60, 30, 0, "N")).toBe(60.5));
    test("20° 15′ 36″ S", () =>
      expect(latitudeToDecimal(20, 15, 36, "S")).toBe(-20.26));
  });
});
describe("Latitude to DMSH", () => {
  describe("Extremes", () => {
    test("0° 0′ 0″ N", () =>
      expect(latitudeToDMSH(0)).toEqual({
        degrees: 0,
        minutes: 0,
        seconds: 0,
        hemisphere: "N",
      }));
    test("0° 0′ 0″ S", () =>
      expect(latitudeToDMSH(-0)).toEqual({
        degrees: 0,
        minutes: 0,
        seconds: 0,
        hemisphere: "S",
      }));
    test("90° 0′ 0″ N", () =>
      expect(latitudeToDMSH(90)).toEqual({
        degrees: 90,
        minutes: 0,
        seconds: 0,
        hemisphere: "N",
      }));
    test("90° 0′ 0″ S", () =>
      expect(latitudeToDMSH(-90)).toEqual({
        degrees: 90,
        minutes: 0,
        seconds: 0,
        hemisphere: "S",
      }));
  });
  describe("Excess", () => {
    test("91° 0′ 0″ N", () => expect(() => latitudeToDMSH(91)).toThrow());
    test("91° 0′ 0″ N", () => expect(() => latitudeToDMSH(-91)).toThrow());
  });
  describe("Examples", () => {
    test("10° 15′ 0″ N", () =>
      expect(latitudeToDMSH(10.25)).toEqual({
        degrees: 10,
        minutes: 15,
        seconds: 0,
        hemisphere: "N",
      }));
    test("50° 30.6′ 0″ N", () =>
      expect(latitudeToDMSH(50.51)).toEqual({
        degrees: 50,
        minutes: 30,
        seconds: 36,
        hemisphere: "N",
      }));
    test("50° 30′ 36″ S", () =>
      expect(latitudeToDMSH(-50.51)).toEqual({
        degrees: 50,
        minutes: 30,
        seconds: 36,
        hemisphere: "S",
      }));
    test("15.1234° 0′ 0″ S", () =>
      expect(latitudeToDMSH(-15.1234)).toEqual({
        degrees: 15,
        minutes: 7,
        seconds: 24.24,
        hemisphere: "S",
      }));
    test("60° 10′ 48″ N", () =>
      expect(latitudeToDMSH(60.18)).toEqual({
        degrees: 60,
        minutes: 10,
        seconds: 48,
        hemisphere: "N",
      }));
    test("60° 30′ 0″ N", () =>
      expect(latitudeToDMSH(60.5)).toEqual({
        degrees: 60,
        minutes: 30,
        seconds: 0,
        hemisphere: "N",
      }));
    test("20° 15′ 36″ S", () =>
      expect(latitudeToDMSH(-20.26)).toEqual({
        degrees: 20,
        minutes: 15,
        seconds: 36,
        hemisphere: "S",
      }));
  });
});
describe("Longitude to decimal", () => {
  describe("Extremes", () => {
    test("0° 0′ 0″ E", () => expect(longitudeToDecimal(0, 0, 0, "E")).toBe(0));
    test("0° 0′ 0″ W", () => expect(longitudeToDecimal(0, 0, 0, "W")).toBe(-0));
    test("180° 0′ 0″ E", () =>
      expect(longitudeToDecimal(180, 0, 0, "E")).toBe(180));
    test("180° 0′ 0″ W", () =>
      expect(longitudeToDecimal(180, 0, 0, "W")).toBe(-180));
  });

  describe("Excess", () => {
    test("181° 0′ 0″ E", () =>
      expect(() => longitudeToDecimal(181, 0, 0, "E")).toThrow());
    test("181° 0′ 0″ W", () =>
      expect(() => longitudeToDecimal(181, 0, 0, "W")).toThrow());
    test("0° 60′ 0″ E", () =>
      expect(() => longitudeToDecimal(0, 60, 0, "E")).toThrow());
    test("0° 60′ 0″ W", () =>
      expect(() => longitudeToDecimal(0, 60, 0, "W")).toThrow());
    test("0° 0′ 60″ E", () =>
      expect(() => longitudeToDecimal(0, 0, 60, "E")).toThrow());
    test("0° 0′ 60″ W", () =>
      expect(() => longitudeToDecimal(0, 0, 60, "W")).toThrow());
    test("180° 0′ 0.1″ E", () =>
      expect(() => longitudeToDecimal(180, 0, 0.1, "E")).toThrow());
    test("180° 0′ 0.1″ W", () =>
      expect(() => longitudeToDecimal(180, 0, 0.1, "W")).toThrow());
  });

  describe("Examples", () => {
    test("60° 10′ 48″ E", () =>
      expect(longitudeToDecimal(60, 10, 48, "E")).toBe(60.18));
    test("50° 30.6′ 0″ E", () =>
      expect(longitudeToDecimal(50, 30.6, 0, "E")).toBe(50.51));
    test("50° 30′ 36″ W", () =>
      expect(longitudeToDecimal(50, 30.6, 0, "W")).toBe(-50.51));
    test("15.1234° 0′ 0″ W", () =>
      expect(longitudeToDecimal(15.1234, 0, 0, "W")).toBe(-15.1234));
    test("24° 56′ 15″ E", () =>
      expect(longitudeToDecimal(24, 56, 15, "E")).toBe(24.9375));
  });
});
describe("Longitude to DMSH", () => {
  describe("Extremes", () => {
    test("0° 0′ 0″ E", () =>
      expect(longitudeToDMSH(0)).toEqual({
        degrees: 0,
        minutes: 0,
        seconds: 0,
        hemisphere: "E",
      }));
    test("0° 0′ 0″ W", () =>
      expect(longitudeToDMSH(-0)).toEqual({
        degrees: 0,
        minutes: 0,
        seconds: 0,
        hemisphere: "W",
      }));
    test("90° 0′ 0″ E", () =>
      expect(longitudeToDMSH(180)).toEqual({
        degrees: 180,
        minutes: 0,
        seconds: 0,
        hemisphere: "E",
      }));
    test("90° 0′ 0″ W", () =>
      expect(longitudeToDMSH(-180)).toEqual({
        degrees: 180,
        minutes: 0,
        seconds: 0,
        hemisphere: "W",
      }));
  });
  describe("Excess", () => {
    test("181° 0′ 0″ E", () => expect(() => longitudeToDMSH(181)).toThrow());
    test("181° 0′ 0″ W", () => expect(() => longitudeToDMSH(-181)).toThrow());
  });
  describe("Examples", () => {
    test("60° 10′ 48″ E", () =>
      expect(longitudeToDMSH(60.18)).toEqual({
        degrees: 60,
        minutes: 10,
        seconds: 48,
        hemisphere: "E",
      }));
    test("50° 30.6′ 0″ E", () =>
      expect(longitudeToDMSH(50.51)).toEqual({
        degrees: 50,
        minutes: 30,
        seconds: 36,
        hemisphere: "E",
      }));
    test("50° 30′ 36″ W", () =>
      expect(longitudeToDMSH(-50.51)).toEqual({
        degrees: 50,
        minutes: 30,
        seconds: 36,
        hemisphere: "W",
      }));
    test("15.1234° 0′ 0″ W", () =>
      expect(longitudeToDMSH(-15.1234)).toEqual({
        degrees: 15,
        minutes: 7,
        seconds: 24.24,
        hemisphere: "W",
      }));
    test("24° 56′ 15″ E", () =>
      expect(longitudeToDMSH(24.9375)).toEqual({
        degrees: 24,
        minutes: 56,
        seconds: 15,
        hemisphere: "E",
      }));
  });
});
