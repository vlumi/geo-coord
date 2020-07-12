const parseString = require("../../../../lib/geo-coord/parse-input/parse-string");

describe("Parse string", () => {
  describe("DD string", () => {
    test("0 0", () => {
      const that = { latitude: undefined, longitude: undefined };
      parseString(that, "0 0");
      expect(that.latitude).toBe(0);
      expect(that.longitude).toBe(0);
    });
    test("1 2", () => {
      const that = { latitude: undefined, longitude: undefined };
      parseString(that, "1 2");
      expect(that.latitude).toBe(1);
      expect(that.longitude).toBe(2);
    });
    test("1° 2°", () => {
      const that = { latitude: undefined, longitude: undefined };
      parseString(that, "1 2");
      expect(that.latitude).toBe(1);
      expect(that.longitude).toBe(2);
    });
    test("1 degrees 2 degrees", () => {
      const that = { latitude: undefined, longitude: undefined };
      parseString(that, "1 2");
      expect(that.latitude).toBe(1);
      expect(that.longitude).toBe(2);
    });
  });
  describe("DMS string", () => {
    test("30°30′36″N 20°15′36″E", () => {
      const that = { latitude: undefined, longitude: undefined };
      parseString(that, "30°30′36″N 20°15′36″E");
      expect(that.latitude).toBe(30.51);
      expect(that.longitude).toBe(20.26);
    });
    test("30° 30′ 36″ N 20° 15′ 36″ E", () => {
      const that = { latitude: undefined, longitude: undefined };
      parseString(that, "30° 30′ 36″ N 20° 15′ 36″ E");
      expect(that.latitude).toBe(30.51);
      expect(that.longitude).toBe(20.26);
    });
    test("30 30' 36\" N 20° 15' 36\" E", () => {
      const that = { latitude: undefined, longitude: undefined };
      parseString(that, "30 30' 36\" N 20° 15' 36\" E");
      expect(that.latitude).toBe(30.51);
      expect(that.longitude).toBe(20.26);
    });
    test("30,30,36 N 20,15,36 E", () => {
      const that = { latitude: undefined, longitude: undefined };
      parseString(that, "30,30,36 N 20,15,36 E");
      expect(that.latitude).toBe(30.51);
      expect(that.longitude).toBe(20.26);
    });
    test("30°30.6′0″N 20°15.6′0″E", () => {
      const that = { latitude: undefined, longitude: undefined };
      parseString(that, "30°30.6′0″N 20°15.6′0″E");
      expect(that.latitude).toBe(30.51);
      expect(that.longitude).toBe(20.26);
    });
  });
});
