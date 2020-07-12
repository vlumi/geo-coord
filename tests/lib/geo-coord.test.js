const { GeoCoord } = require("../../lib/geo-coord");

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
    //   test("DMS values", () =>
    //     expect(new Coordinates(0, 0, 0, "N", 0, 0, 0, "E").toString()).toBe(
    //       "0° 0′ 0″ N 0° 0′ 0″ E"
    //     ));
    test("Object holding DD", () =>
      expect(
        new GeoCoord({
          latitude: 0,
          longitude: 0,
        }).toString()
      ).toBe("0°0′0″N 0°0′0″E"));
    test("DD values", () =>
      expect(new GeoCoord(0, 0).toString()).toBe("0°0′0″N 0°0′0″E"));
    //   test("DMS string", () =>
    //     expect(new Coordinates("0° 0′ 0″ N 0° 0′ 0″ E").toString()).toBe(
    //       "0° 0′ 0″ N 0° 0′ 0″ E"
    //     ));
    //   test("DM string", () =>
    //     expect(new Coordinates("0° 0′ N 0° 0′ E").toString()).toBe(
    //       "0° 0′ 0″ N 0° 0′ 0″ E"
    //     ));
    //   test("D string", () =>
    //     expect(new Coordinates("0° N 0° E").toString()).toBe(
    //       "0° 0′ 0″ N 0° 0′ 0″ E"
    //     ));
    //   test("DD string", () =>
    //     expect(new Coordinates("0° 0°").toString()).toBe(
    //       "0° 0′ 0″ N 0° 0′ 0″ E"
    //     ));
  });
  describe("Examples", () => {
    test("1°2′3″N 4°5′6″E", () =>
      expect(
        new GeoCoord({
          latitude: { degrees: 1, minutes: 2, seconds: 3, hemisphere: "N" },
          longitude: { degrees: 4, minutes: 5, seconds: 6, hemisphere: "E" },
        }).toString()
      ).toBe("1°2′3″N 4°5′6″E"));
    test("Helsinki, Finland: 60°10′15″N 24°56′15″E", () =>
      expect(
        new GeoCoord(
          { degrees: 60, minutes: 10, seconds: 15, hemisphere: "N" },
          { degrees: 24, minutes: 56, seconds: 15, hemisphere: "E" }
        ).toString()
      ).toBe("60°10′15″N 24°56′15″E"));
    test("The Hague, Netherlands: 52°5′N 4°19′E", () =>
      expect(
        new GeoCoord(
          { degrees: 52, minutes: 5, seconds: 0, hemisphere: "N" },
          { degrees: 4, minutes: 19, seconds: 0, hemisphere: "E" }
        ).toString()
      ).toBe("52°5′0″N 4°19′0″E"));
    test("Fukuoka, Japan: 33°35′N 130°24′E", () =>
      expect(
        new GeoCoord(
          { degrees: 33, minutes: 35, seconds: 0, hemisphere: "N" },
          { degrees: 130, minutes: 24, seconds: 0, hemisphere: "E" }
        ).toString()
      ).toBe("33°35′0″N 130°24′0″E"));
  });
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
