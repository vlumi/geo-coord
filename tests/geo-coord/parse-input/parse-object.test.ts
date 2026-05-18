import { describe, expect, test } from "vitest";
import parseObject from "../../../src/geo-coord/parse-input/parse-object.js";

const sink = () => ({ latitude: 0, longitude: 0 });

describe("Parse part", () => {
  describe("2 DD values", () => {
    test("{ latitude: 0, longitude: 0 }", () => {
      const that = sink();
      parseObject(that, { latitude: 0, longitude: 0 });
      expect(that.latitude).toBe(0);
      expect(that.longitude).toBe(0);
    });
    test("{ latitude: 1, longitude: 2 }", () => {
      const that = sink();
      parseObject(that, { latitude: 1, longitude: 2 });
      expect(that.latitude).toBe(1);
      expect(that.longitude).toBe(2);
    });
  });
  describe("2 DMS values", () => {
    test("{ latitude: { 1, N }, longitude: { 2, E } }", () => {
      const that = sink();
      parseObject(that, {
        latitude: { degrees: 1, hemisphere: "N" },
        longitude: { degrees: 2, hemisphere: "E" },
      });
      expect(that.latitude).toBe(1);
      expect(that.longitude).toBe(2);
    });
    test("{ latitude: { 1, 0, 0, N }, longitude: { 2, 0, 0, E } }", () => {
      const that = sink();
      parseObject(that, {
        latitude: { degrees: 1, minutes: 0, seconds: 0, hemisphere: "N" },
        longitude: { degrees: 2, minutes: 0, seconds: 0, hemisphere: "E" },
      });
      expect(that.latitude).toBe(1);
      expect(that.longitude).toBe(2);
    });
    test("{ latitude: { 1, 30, 18, S }, longitude: { 2, 30, 18, W } }", () => {
      const that = sink();
      parseObject(that, {
        latitude: { degrees: 1, minutes: 30, seconds: 18, hemisphere: "S" },
        longitude: { degrees: 2, minutes: 45, seconds: 36, hemisphere: "W" },
      });
      expect(that.latitude).toBe(-1.505);
      expect(that.longitude).toBe(-2.76);
    });
  });
  describe("Invalid", () => {
    test("No latitude", () => {
      const that = sink();
      expect(() => parseObject(that, { longitude: 0 })).toThrow();
    });
    test("No longitude", () => {
      const that = sink();
      expect(() => parseObject(that, { latitude: 0 })).toThrow();
    });
    test("String latitude", () => {
      const that = sink();
      expect(() => parseObject(that, { latitude: "0", longitude: 0 })).toThrow();
    });
    test("String longitude", () => {
      const that = sink();
      expect(() => parseObject(that, { latitude: 0, longitude: "0" })).toThrow();
    });
  });
});
