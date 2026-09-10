import { describe, expect, test } from "vitest";
import { COMPASS_POINTS, compassIndex, compassPoint } from "../src/compass.js";

describe("Compass", () => {
  test("sixteen points clockwise from north", () => {
    expect(COMPASS_POINTS).toHaveLength(16);
    expect(COMPASS_POINTS[0]).toBe("N");
    expect(COMPASS_POINTS[4]).toBe("E");
  });
  describe("compassPoint", () => {
    test("eight points by default", () => {
      expect(compassPoint(0)).toBe("N");
      expect(compassPoint(44)).toBe("NE");
      expect(compassPoint(180)).toBe("S");
      expect(compassPoint(359)).toBe("N");
      expect(compassPoint(-90)).toBe("W");
      expect(compassPoint(720 + 225)).toBe("SW");
    });
    test("sixteen points", () => {
      expect(compassPoint(22.5, 16)).toBe("NNE");
      expect(compassPoint(100, 16)).toBe("E");
      expect(compassPoint(350, 16)).toBe("N");
    });
    test("four points", () => {
      expect(compassPoint(44, 4)).toBe("N");
      expect(compassPoint(46, 4)).toBe("E");
    });
  });
  describe("compassIndex", () => {
    test("counts clockwise from north for the caller to name", () => {
      expect(compassIndex(225)).toBe(5);
      expect(compassIndex(225, 16)).toBe(10);
      expect(compassIndex(359.9, 16)).toBe(0);
    });
  });
});
