const {
  GeoCoord,
  latitudeToDecimal,
  latitudeToDMSH,
  longitudeToDecimal,
  longitudeToDMSH,
} = require("../index");

describe("GeoCoord", () => {
  describe("To String", () => {
    describe("Origo", () => {
      test("Object holding DMSH", () =>
        expect(
          new GeoCoord({
            latitude: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "N" },
            longitude: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "E" },
          }).toString()
        ).toBe("0°0′0″N 0°0′0″E"));
      test("DMSH objects", () =>
        expect(
          new GeoCoord(
            { degrees: 0, minutes: 0, seconds: 0, hemisphere: "N" },
            { degrees: 0, minutes: 0, seconds: 0, hemisphere: "E" }
          ).toString()
        ).toBe("0°0′0″N 0°0′0″E"));
      //   test("DMSH values", () =>
      //     expect(new Coordinates(0, 0, 0, "N", 0, 0, 0, "E").toString()).toBe(
      //       "0° 0′ 0″ N 0° 0′ 0″ E"
      //     ));
      test("Object holding decimals", () =>
        expect(
          new GeoCoord({
            latitude: 0,
            longitude: 0,
          }).toString()
        ).toBe("0°0′0″N 0°0′0″E"));
      test("Decimal values", () =>
        expect(new GeoCoord(0, 0).toString()).toBe("0°0′0″N 0°0′0″E"));
      //   test("DMSH string", () =>
      //     expect(new Coordinates("0° 0′ 0″ N 0° 0′ 0″ E").toString()).toBe(
      //       "0° 0′ 0″ N 0° 0′ 0″ E"
      //     ));
      //   test("DMH string", () =>
      //     expect(new Coordinates("0° 0′ N 0° 0′ E").toString()).toBe(
      //       "0° 0′ 0″ N 0° 0′ 0″ E"
      //     ));
      //   test("DH string", () =>
      //     expect(new Coordinates("0° N 0° E").toString()).toBe(
      //       "0° 0′ 0″ N 0° 0′ 0″ E"
      //     ));
      //   test("Decimal string", () =>
      //     expect(new Coordinates("0° 0°").toString()).toBe(
      //       "0° 0′ 0″ N 0° 0′ 0″ E"
      //     ));
    });
    describe("Examples", () => {
      test("DMSH object 1°2′3″N 4°5′6″E", () =>
        expect(
          new GeoCoord({
            latitude: { degrees: 1, minutes: 2, seconds: 3, hemisphere: "N" },
            longitude: { degrees: 4, minutes: 5, seconds: 6, hemisphere: "E" },
          }).toString()
        ).toBe("1°2′3″N 4°5′6″E"));
      test("DMSH object 60°10′15″N 24°56′15″E", () =>
        expect(
          new GeoCoord(
            { degrees: 60, minutes: 10, seconds: 15, hemisphere: "N" },
            { degrees: 24, minutes: 56, seconds: 15, hemisphere: "E" }
          ).toString()
        ).toBe("60°10′15″N 24°56′15″E"));
    });
  });
});

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
      expect(() => latitudeToDecimal(91, 0, 0, "N")).toThrowError());
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
    test("0° 0′ 0″ N", () =>
      expect(latitudeToDMSH(90)).toEqual({
        degrees: 90,
        minutes: 0,
        seconds: 0,
        hemisphere: "N",
      }));
    test("0° 0′ 0″ S", () =>
      expect(latitudeToDMSH(-90)).toEqual({
        degrees: 90,
        minutes: 0,
        seconds: 0,
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
    test("181° 0′ 0″ N", () =>
      expect(() => longitudeToDecimal(181, 0, 0, "N")).toThrowError());
    test("181° 0′ 0″ N", () =>
      expect(() => longitudeToDecimal(181, 0, 0, "S")).toThrow());
    test("0° 60′ 0″ N", () =>
      expect(() => longitudeToDecimal(0, 60, 0, "N")).toThrow());
    test("0° 60′ 0″ N", () =>
      expect(() => longitudeToDecimal(0, 60, 0, "S")).toThrow());
    test("0° 0′ 60″ N", () =>
      expect(() => longitudeToDecimal(0, 0, 60, "N")).toThrow());
    test("0° 0′ 60″ N", () =>
      expect(() => longitudeToDecimal(0, 0, 60, "S")).toThrow());
    test("180° 0′ 0.1″ N", () =>
      expect(() => longitudeToDecimal(180, 0, 0.1, "N")).toThrow());
    test("180° 0′ 0.1″ N", () =>
      expect(() => longitudeToDecimal(180, 0, 0.1, "S")).toThrow());
  });

  describe("Examples", () => {
    test("60° 10′ 15″ E", () =>
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
    test("0° 0′ 0″ N", () =>
      expect(longitudeToDMSH(0)).toEqual({
        degrees: 0,
        minutes: 0,
        seconds: 0,
        hemisphere: "E",
      }));
    test("0° 0′ 0″ S", () =>
      expect(longitudeToDMSH(-0)).toEqual({
        degrees: 0,
        minutes: 0,
        seconds: 0,
        hemisphere: "W",
      }));
    test("0° 0′ 0″ N", () =>
      expect(longitudeToDMSH(180)).toEqual({
        degrees: 180,
        minutes: 0,
        seconds: 0,
        hemisphere: "E",
      }));
    test("0° 0′ 0″ S", () =>
      expect(longitudeToDMSH(-180)).toEqual({
        degrees: 180,
        minutes: 0,
        seconds: 0,
        hemisphere: "W",
      }));
  });
});
