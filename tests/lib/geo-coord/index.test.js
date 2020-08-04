const { GeoCoord } = require("../../../lib/geo-coord/index");

describe("GeoCoord", () => {
  describe("To String", () => {
    describe("Origo", () => {
      test("Object holding DMS", () =>
        expect(
          new GeoCoord({
            latitude: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "N" },
            longitude: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "E" },
          }).toString()
        ).toBe("0°0′0″N 0°0′0″E"));
      test("DMS objects", () =>
        expect(
          new GeoCoord(
            { degrees: 0, minutes: 0, seconds: 0, hemisphere: "N" },
            { degrees: 0, minutes: 0, seconds: 0, hemisphere: "E" }
          ).toString()
        ).toBe("0°0′0″N 0°0′0″E"));
      test("DMS values", () =>
        expect(new GeoCoord(0, 0, 0, "N", 0, 0, 0, "E").toString()).toBe(
          "0°0′0″N 0°0′0″E"
        ));
      test("Object holding DD", () =>
        expect(
          new GeoCoord({
            latitude: 0,
            longitude: 0,
          }).toString()
        ).toBe("0°0′0″N 0°0′0″E"));
      test("DD values", () =>
        expect(new GeoCoord(0, 0).toString()).toBe("0°0′0″N 0°0′0″E"));
      test("DMS string", () =>
        expect(new GeoCoord("0°0′0″N 0°0′0″E").toString()).toBe(
          "0°0′0″N 0°0′0″E"
        ));
      test("DM string", () =>
        expect(new GeoCoord("0°0′N 0°0′E").toString()).toBe("0°0′0″N 0°0′0″E"));
      test("D string", () =>
        expect(new GeoCoord("0°N 0°E").toString()).toBe("0°0′0″N 0°0′0″E"));
      test("DD string", () =>
        expect(new GeoCoord("0° 0°").toString()).toBe("0°0′0″N 0°0′0″E"));
    });
    describe("Examples", () => {
      test("1°2′3″N 4°5′6″E", () =>
        expect(new GeoCoord("1°2′3″N 4°5′6″E").toString()).toBe(
          "1°2′3″N 4°5′6″E"
        ));
      test("Helsinki, Finland: 60°10′15″N 24°56′15″E", () =>
        expect(new GeoCoord("60°10′15″N 24°56′15″E").toString()).toBe(
          "60°10′15″N 24°56′15″E"
        ));
      test("The Hague, Netherlands: 52°5′N 4°19′E", () =>
        expect(new GeoCoord("52°5′0″N 4°19′0″E").toString()).toBe(
          "52°5′0″N 4°19′0″E"
        ));
      test("Fukuoka, Japan: 33°35′N 130°24′E", () =>
        expect(new GeoCoord("33°35′0″N 130°24′0″E").toString()).toBe(
          "33°35′0″N 130°24′0″E"
        ));
    });
  });
  describe("Round to Degrees", () => {
    test("0°0′0″N 0°0′0″E", () =>
      expect(
        new GeoCoord(
          { degrees: 0, minutes: 0, seconds: 0, hemisphere: "N" },
          { degrees: 0, minutes: 0, seconds: 0, hemisphere: "E" }
        )
          .roundToDegrees()
          .toDMS()
      ).toEqual({
        latitude: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "N" },
        longitude: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "E" },
      }));
    test("0°29′29.999999″N 0°29′29.999999″E", () =>
      expect(
        new GeoCoord(
          { degrees: 0, minutes: 29, seconds: 29.999999, hemisphere: "N" },
          { degrees: 0, minutes: 29, seconds: 29.999999, hemisphere: "E" }
        )
          .roundToDegrees()
          .toDMS()
      ).toEqual({
        latitude: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "N" },
        longitude: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "E" },
      }));
    test("0°30′0″N 0°30′0″E", () =>
      expect(
        new GeoCoord(
          { degrees: 0, minutes: 30, seconds: 0, hemisphere: "N" },
          { degrees: 0, minutes: 30, seconds: 0, hemisphere: "E" }
        )
          .roundToDegrees()
          .toDMS()
      ).toEqual({
        latitude: { degrees: 1, minutes: 0, seconds: 0, hemisphere: "N" },
        longitude: { degrees: 1, minutes: 0, seconds: 0, hemisphere: "E" },
      }));
    test("89°30′0″N 179°30′0″E", () =>
      expect(
        new GeoCoord(
          { degrees: 89, minutes: 30, seconds: 0, hemisphere: "N" },
          { degrees: 179, minutes: 30, seconds: 0, hemisphere: "E" }
        )
          .roundToDegrees()
          .toDMS()
      ).toEqual({
        latitude: { degrees: 90, minutes: 0, seconds: 0, hemisphere: "N" },
        longitude: { degrees: 180, minutes: 0, seconds: 0, hemisphere: "E" },
      }));
  });
  describe("Round to Minutes", () => {
    test("0°0′0″N 0°0′0″E", () =>
      expect(
        new GeoCoord(
          { degrees: 0, minutes: 0, seconds: 0, hemisphere: "N" },
          { degrees: 0, minutes: 0, seconds: 0, hemisphere: "E" }
        )
          .roundToMinutes()
          .toDMS()
      ).toEqual({
        latitude: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "N" },
        longitude: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "E" },
      }));
    test("0°0′29.999999″N 0°0′29.999999″E", () =>
      expect(
        new GeoCoord(
          { degrees: 0, minutes: 0, seconds: 29.999999, hemisphere: "N" },
          { degrees: 0, minutes: 0, seconds: 29.999999, hemisphere: "E" }
        )
          .roundToMinutes()
          .toDMS()
      ).toEqual({
        latitude: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "N" },
        longitude: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "E" },
      }));
    test("0°0′30″N 0°0′30″E", () =>
      expect(
        new GeoCoord(
          { degrees: 0, minutes: 0, seconds: 30, hemisphere: "N" },
          { degrees: 0, minutes: 0, seconds: 30, hemisphere: "E" }
        )
          .roundToMinutes()
          .toDMS()
      ).toEqual({
        latitude: { degrees: 0, minutes: 1, seconds: 0, hemisphere: "N" },
        longitude: { degrees: 0, minutes: 1, seconds: 0, hemisphere: "E" },
      }));
    test("0°59′30″N 0°59′30″E", () =>
      expect(
        new GeoCoord(
          { degrees: 0, minutes: 59, seconds: 30, hemisphere: "N" },
          { degrees: 0, minutes: 59, seconds: 30, hemisphere: "E" }
        )
          .roundToMinutes()
          .toDMS()
      ).toEqual({
        latitude: { degrees: 1, minutes: 0, seconds: 0, hemisphere: "N" },
        longitude: { degrees: 1, minutes: 0, seconds: 0, hemisphere: "E" },
      }));
    test("89°59′30″N 179°59′30″E", () =>
      expect(
        new GeoCoord(
          { degrees: 89, minutes: 59, seconds: 30, hemisphere: "N" },
          { degrees: 179, minutes: 59, seconds: 30, hemisphere: "E" }
        )
          .roundToMinutes()
          .toDMS()
      ).toEqual({
        latitude: { degrees: 90, minutes: 0, seconds: 0, hemisphere: "N" },
        longitude: { degrees: 180, minutes: 0, seconds: 0, hemisphere: "E" },
      }));
    test("0°0′0″S 0°0′0″W", () =>
      expect(
        new GeoCoord(
          { degrees: 0, minutes: 0, seconds: 0, hemisphere: "S" },
          { degrees: 0, minutes: 0, seconds: 0, hemisphere: "W" }
        )
          .roundToMinutes()
          .toDMS()
      ).toEqual({
        latitude: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "S" },
        longitude: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "W" },
      }));
    test("0°0′29.999999″S 0°0′29.999999″W", () =>
      expect(
        new GeoCoord(
          { degrees: 0, minutes: 0, seconds: 29.999999, hemisphere: "S" },
          { degrees: 0, minutes: 0, seconds: 29.999999, hemisphere: "W" }
        )
          .roundToMinutes()
          .toDMS()
      ).toEqual({
        latitude: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "S" },
        longitude: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "W" },
      }));
    test("0°0′30″S 0°0′30″W", () =>
      expect(
        new GeoCoord(
          { degrees: 0, minutes: 0, seconds: 30, hemisphere: "S" },
          { degrees: 0, minutes: 0, seconds: 30, hemisphere: "W" }
        )
          .roundToMinutes()
          .toDMS()
      ).toEqual({
        latitude: { degrees: 0, minutes: 1, seconds: 0, hemisphere: "S" },
        longitude: { degrees: 0, minutes: 1, seconds: 0, hemisphere: "W" },
      }));
    test("0°59′30″S 0°59′30″W", () =>
      expect(
        new GeoCoord(
          { degrees: 0, minutes: 59, seconds: 30, hemisphere: "S" },
          { degrees: 0, minutes: 59, seconds: 30, hemisphere: "W" }
        )
          .roundToMinutes()
          .toDMS()
      ).toEqual({
        latitude: { degrees: 1, minutes: 0, seconds: 0, hemisphere: "S" },
        longitude: { degrees: 1, minutes: 0, seconds: 0, hemisphere: "W" },
      }));
    test("89°59′30″S 179°59′30″W", () =>
      expect(
        new GeoCoord(
          { degrees: 89, minutes: 59, seconds: 30, hemisphere: "S" },
          { degrees: 179, minutes: 59, seconds: 30, hemisphere: "W" }
        )
          .roundToMinutes()
          .toDMS()
      ).toEqual({
        latitude: { degrees: 90, minutes: 0, seconds: 0, hemisphere: "S" },
        longitude: { degrees: 180, minutes: 0, seconds: 0, hemisphere: "W" },
      }));
  });
  describe("Round to Seconds", () => {
    test("0°0′0″N 0°0′0″E", () =>
      expect(
        new GeoCoord(
          { degrees: 0, minutes: 0, seconds: 0, hemisphere: "N" },
          { degrees: 0, minutes: 0, seconds: 0, hemisphere: "E" }
        )
          .roundToSeconds()
          .toDMS()
      ).toEqual({
        latitude: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "N" },
        longitude: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "E" },
      }));
    test("0°0′0.499999″N 0°0′0.499999″E", () =>
      expect(
        new GeoCoord(
          { degrees: 0, minutes: 0, seconds: 0.499999, hemisphere: "N" },
          { degrees: 0, minutes: 0, seconds: 0.499999, hemisphere: "E" }
        )
          .roundToSeconds()
          .toDMS()
      ).toEqual({
        latitude: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "N" },
        longitude: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "E" },
      }));
    test("0°0′0.5″N 0°0′0.5″E", () =>
      expect(
        new GeoCoord(
          { degrees: 0, minutes: 0, seconds: 0.5, hemisphere: "N" },
          { degrees: 0, minutes: 0, seconds: 0.5, hemisphere: "E" }
        )
          .roundToSeconds()
          .toDMS()
      ).toEqual({
        latitude: { degrees: 0, minutes: 0, seconds: 1, hemisphere: "N" },
        longitude: { degrees: 0, minutes: 0, seconds: 1, hemisphere: "E" },
      }));
    test("0°0′59.5″N 0°0′59.5″E", () =>
      expect(
        new GeoCoord(
          { degrees: 0, minutes: 0, seconds: 59.5, hemisphere: "N" },
          { degrees: 0, minutes: 0, seconds: 59.5, hemisphere: "E" }
        )
          .roundToSeconds()
          .toDMS()
      ).toEqual({
        latitude: { degrees: 0, minutes: 1, seconds: 0, hemisphere: "N" },
        longitude: { degrees: 0, minutes: 1, seconds: 0, hemisphere: "E" },
      }));
    test("0°59′59.5″N 0°59′59.5″E", () =>
      expect(
        new GeoCoord(
          { degrees: 0, minutes: 59, seconds: 59.5, hemisphere: "N" },
          { degrees: 0, minutes: 59, seconds: 59.5, hemisphere: "E" }
        )
          .roundToSeconds()
          .toDMS()
      ).toEqual({
        latitude: { degrees: 1, minutes: 0, seconds: 0, hemisphere: "N" },
        longitude: { degrees: 1, minutes: 0, seconds: 0, hemisphere: "E" },
      }));
    test("89°59′59.5″N 179°59′59.5″E", () =>
      expect(
        new GeoCoord(
          { degrees: 89, minutes: 59, seconds: 59.5, hemisphere: "N" },
          { degrees: 179, minutes: 59, seconds: 59.5, hemisphere: "E" }
        )
          .roundToSeconds()
          .toDMS()
      ).toEqual({
        latitude: { degrees: 90, minutes: 0, seconds: 0, hemisphere: "N" },
        longitude: { degrees: 180, minutes: 0, seconds: 0, hemisphere: "E" },
      }));
    test("0°0′0.499999″S 0°0′0.499999″W", () =>
      expect(
        new GeoCoord(
          { degrees: 0, minutes: 0, seconds: 0.499999, hemisphere: "S" },
          { degrees: 0, minutes: 0, seconds: 0.499999, hemisphere: "W" }
        )
          .roundToSeconds()
          .toDMS()
      ).toEqual({
        latitude: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "S" },
        longitude: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "W" },
      }));
    test("0°0′0.5″S 0°0′0.5″W", () =>
      expect(
        new GeoCoord(
          { degrees: 0, minutes: 0, seconds: 0.5, hemisphere: "S" },
          { degrees: 0, minutes: 0, seconds: 0.5, hemisphere: "W" }
        )
          .roundToSeconds()
          .toDMS()
      ).toEqual({
        latitude: { degrees: 0, minutes: 0, seconds: 1, hemisphere: "S" },
        longitude: { degrees: 0, minutes: 0, seconds: 1, hemisphere: "W" },
      }));
    test("0°0′59.5″S 0°0′59.5″W", () =>
      expect(
        new GeoCoord(
          { degrees: 0, minutes: 0, seconds: 59.5, hemisphere: "S" },
          { degrees: 0, minutes: 0, seconds: 59.5, hemisphere: "W" }
        )
          .roundToSeconds()
          .toDMS()
      ).toEqual({
        latitude: { degrees: 0, minutes: 1, seconds: 0, hemisphere: "S" },
        longitude: { degrees: 0, minutes: 1, seconds: 0, hemisphere: "W" },
      }));
    test("0°59′59.5″S 0°59′59.5″W", () =>
      expect(
        new GeoCoord(
          { degrees: 0, minutes: 59, seconds: 59.5, hemisphere: "S" },
          { degrees: 0, minutes: 59, seconds: 59.5, hemisphere: "W" }
        )
          .roundToSeconds()
          .toDMS()
      ).toEqual({
        latitude: { degrees: 1, minutes: 0, seconds: 0, hemisphere: "S" },
        longitude: { degrees: 1, minutes: 0, seconds: 0, hemisphere: "W" },
      }));
    test("89°59′59.5″S 179°59′59.5″W", () =>
      expect(
        new GeoCoord(
          { degrees: 89, minutes: 59, seconds: 59.5, hemisphere: "S" },
          { degrees: 179, minutes: 59, seconds: 59.5, hemisphere: "W" }
        )
          .roundToSeconds()
          .toDMS()
      ).toEqual({
        latitude: { degrees: 90, minutes: 0, seconds: 0, hemisphere: "S" },
        longitude: { degrees: 180, minutes: 0, seconds: 0, hemisphere: "W" },
      }));
  });
  describe("To DD", () => {
    const normalizeResult = (coordinates) => {
      const normalize = (value) => Math.round(value * 1000000) / 1000000;
      return {
        latitude: normalize(coordinates.latitude),
        longitude: normalize(coordinates.longitude),
      };
    };
    test("0°0′0″N 0°0′0″E", () =>
      expect(
        normalizeResult(
          new GeoCoord(
            { degrees: 0, minutes: 0, seconds: 0, hemisphere: "N" },
            { degrees: 0, minutes: 0, seconds: 0, hemisphere: "E" }
          ).toDD()
        )
      ).toEqual({ latitude: 0, longitude: 0 }));
    test("Helsinki, Finland: 60°10′15″N 24°56′15″E", () =>
      expect(
        normalizeResult(
          new GeoCoord(
            { degrees: 60, minutes: 10, seconds: 15, hemisphere: "N" },
            { degrees: 24, minutes: 56, seconds: 15, hemisphere: "E" }
          ).toDD()
        )
      ).toEqual({ latitude: 60.170833, longitude: 24.9375 }));
    test("The Hague, Netherlands: 52°5′N 4°19′E", () =>
      expect(
        normalizeResult(
          new GeoCoord(
            { degrees: 52, minutes: 5, seconds: 0, hemisphere: "N" },
            { degrees: 4, minutes: 19, seconds: 0, hemisphere: "E" }
          ).toDD()
        )
      ).toEqual({ latitude: 52.083333, longitude: 4.316667 }));
    test("Fukuoka, Japan: 33°35′N 130°24′E", () =>
      expect(
        normalizeResult(
          new GeoCoord(
            { degrees: 33, minutes: 35, seconds: 0, hemisphere: "N" },
            { degrees: 130, minutes: 24, seconds: 0, hemisphere: "E" }
          ).toDD()
        )
      ).toEqual({ latitude: 33.583333, longitude: 130.4 }));
  });
  describe("To DMS", () => {
    test("0°0′0″N 0°0′0″E", () =>
      expect(
        new GeoCoord(
          { degrees: 0, minutes: 0, seconds: 0, hemisphere: "N" },
          { degrees: 0, minutes: 0, seconds: 0, hemisphere: "E" }
        ).toDMS()
      ).toEqual({
        latitude: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "N" },
        longitude: { degrees: 0, minutes: 0, seconds: 0, hemisphere: "E" },
      }));
    test("Helsinki, Finland: 60°10′15″N 24°56′15″E", () =>
      expect(
        new GeoCoord(
          { degrees: 60, minutes: 10, seconds: 15, hemisphere: "N" },
          { degrees: 24, minutes: 56, seconds: 15, hemisphere: "E" }
        ).toDMS()
      ).toEqual({
        latitude: { degrees: 60, minutes: 10, seconds: 15, hemisphere: "N" },
        longitude: { degrees: 24, minutes: 56, seconds: 15, hemisphere: "E" },
      }));
    test("The Hague, Netherlands: 52°5′N 4°19′E", () =>
      expect(
        new GeoCoord(
          { degrees: 52, minutes: 5, seconds: 0, hemisphere: "N" },
          { degrees: 4, minutes: 19, seconds: 0, hemisphere: "E" }
        ).toDMS()
      ).toEqual({
        latitude: { degrees: 52, minutes: 5, seconds: 0, hemisphere: "N" },
        longitude: { degrees: 4, minutes: 19, seconds: 0, hemisphere: "E" },
      }));
    test("Fukuoka, Japan: 33°35′N 130°24′E", () =>
      expect(
        new GeoCoord(
          { degrees: 33, minutes: 35, seconds: 0, hemisphere: "N" },
          { degrees: 130, minutes: 24, seconds: 0, hemisphere: "E" }
        ).toDMS()
      ).toEqual({
        latitude: { degrees: 33, minutes: 35, seconds: 0, hemisphere: "N" },
        longitude: { degrees: 130, minutes: 24, seconds: 0, hemisphere: "E" },
      }));
  });
});
