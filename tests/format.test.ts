import { describe, expect, test } from "vitest";
import {
  formatCoordinates,
  formatLatitude,
  formatLongitude,
} from "../src/format.js";

const tokyo = { latitude: 35.6812, longitude: 139.7671 };
const santiago = { latitude: -33.8688, longitude: -70.6483 };

describe("Format", () => {
  describe("decimal degrees", () => {
    test("defaults to four decimals with hemisphere letters", () =>
      expect(formatCoordinates(tokyo)).toBe("35.6812°N 139.7671°E"));
    test("southern and western hemispheres", () =>
      expect(formatCoordinates(santiago, { precision: 2 })).toBe(
        "33.87°S 70.65°W",
      ));
    test("a value that rounds to zero is north and east", () =>
      expect(
        formatCoordinates(
          { latitude: -0.0001, longitude: -0.0001 },
          { precision: 2 },
        ),
      ).toBe("0.00°N 0.00°E"));
    test("sign style", () =>
      expect(formatCoordinates(santiago, { hemisphere: "sign" })).toBe(
        "-33.8688° -70.6483°",
      ));
    test("plain numbers through the symbols and separator", () =>
      expect(
        formatCoordinates(tokyo, {
          hemisphere: "sign",
          symbols: { degrees: "" },
          separator: ", ",
        }),
      ).toBe("35.6812, 139.7671"));
    test("hemisphere words leading, as in Japanese", () =>
      expect(
        formatCoordinates(tokyo, {
          precision: 2,
          hemispheres: { N: "北緯", S: "南緯", E: "東経", W: "西経" },
          hemispherePosition: "before",
          symbols: { degrees: "度" },
        }),
      ).toBe("北緯35.68度 東経139.77度"));
  });

  describe("degrees, minutes, seconds", () => {
    test("whole seconds by default", () =>
      expect(formatLatitude(60.1699, { style: "dms" })).toBe("60°10′12″N"));
    test("seconds with decimals", () =>
      expect(formatLongitude(24.9384, { style: "dms", precision: 1 })).toBe(
        "24°56′18.2″E",
      ));
    test("rounding carries into minutes and degrees", () =>
      expect(formatLatitude(59.999999, { style: "dms" })).toBe("60°0′0″N"));
    test("negative values take the other hemisphere", () =>
      expect(formatCoordinates(santiago, { style: "dms" })).toBe(
        "33°52′8″S 70°38′54″W",
      ));
    test("sign style", () =>
      expect(formatLatitude(-33.5, { style: "dms", hemisphere: "sign" })).toBe(
        "-33°30′0″",
      ));
    test("a value that rounds to zero is north", () =>
      expect(formatLatitude(-0.00001, { style: "dms" })).toBe("0°0′0″N"));
    test("Japanese symbols", () =>
      expect(
        formatLatitude(35.6812, {
          style: "dms",
          hemispheres: { N: "北緯" },
          hemispherePosition: "before",
          symbols: { degrees: "度", minutes: "分", seconds: "秒" },
        }),
      ).toBe("北緯35度40分52秒"));
  });

  describe("invalid", () => {
    test("latitude beyond the poles", () => {
      expect(() => formatLatitude(90.1)).toThrow();
      expect(() => formatLatitude(NaN)).toThrow();
    });
    test("longitude beyond the antimeridian", () =>
      expect(() => formatLongitude(-180.1)).toThrow());
    test("the edges are fine", () => {
      expect(formatLatitude(-90)).toBe("90.0000°S");
      expect(formatLongitude(180)).toBe("180.0000°E");
    });
  });
});
