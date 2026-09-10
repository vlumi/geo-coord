import { describe, expect, test } from "vitest";
import {
  longitudeDelta,
  normalizeLongitude,
  splitAtAntimeridian,
  unwrapPath,
} from "../src/longitude.js";

const path = (...points: [number, number][]) =>
  points.map(([longitude, latitude]) => ({ latitude, longitude }));

describe("Longitude", () => {
  describe("normalizeLongitude", () => {
    test("in range stays", () => {
      expect(normalizeLongitude(0)).toBe(0);
      expect(normalizeLongitude(-180)).toBe(-180);
      expect(normalizeLongitude(179.5)).toBe(179.5);
    });
    test("180 becomes -180", () => expect(normalizeLongitude(180)).toBe(-180));
    test("past the edge", () => {
      expect(normalizeLongitude(190)).toBe(-170);
      expect(normalizeLongitude(-190)).toBe(170);
    });
    test("whole turns", () => {
      expect(normalizeLongitude(360)).toBe(0);
      expect(normalizeLongitude(-720)).toBe(0);
      expect(normalizeLongitude(540)).toBe(-180);
    });
  });

  describe("longitudeDelta", () => {
    test("eastward is positive", () => expect(longitudeDelta(10, 30)).toBe(20));
    test("westward is negative", () => expect(longitudeDelta(30, 10)).toBe(-20));
    test("takes the short way across the antimeridian", () => {
      expect(longitudeDelta(170, -170)).toBe(20);
      expect(longitudeDelta(-170, 170)).toBe(-20);
    });
    test("half a turn is -180", () => expect(longitudeDelta(0, 180)).toBe(-180));
  });

  describe("unwrapPath", () => {
    test("a path without a crossing is unchanged", () =>
      expect(unwrapPath(path([10, 0], [20, 1], [30, 2]))).toEqual(
        path([10, 0], [20, 1], [30, 2]),
      ));
    test("a crossing continues past 180", () =>
      expect(unwrapPath(path([170, 0], [-170, 1], [-160, 2]))).toEqual(
        path([170, 0], [190, 1], [200, 2]),
      ));
    test("a crossing continues past -180", () =>
      expect(unwrapPath(path([-170, 0], [170, 1]))).toEqual(
        path([-170, 0], [-190, 1]),
      ));
    test("crossing back returns to the original longitudes", () =>
      expect(unwrapPath(path([170, 0], [-170, 1], [170, 2]))).toEqual(
        path([170, 0], [190, 1], [170, 2]),
      ));
    test("empty stays empty", () => expect(unwrapPath([])).toEqual([]));
  });

  describe("splitAtAntimeridian", () => {
    test("the crossing point lands on both edges", () => {
      const pieces = splitAtAntimeridian(
        path([170, 10], [178, 12], [-178, 14], [-170, 16], [175, 18]),
      );
      expect(pieces.map((piece) => piece.length)).toEqual([3, 4, 2]);
      expect(pieces[0]?.[2]).toEqual({ latitude: 13, longitude: 180 });
      expect(pieces[1]?.[0]).toEqual({ latitude: 13, longitude: -180 });
      expect(pieces[1]?.[3]?.longitude).toBe(-180);
      expect(pieces[1]?.[3]?.latitude).toBeCloseTo(17.333, 3);
      expect(pieces[2]?.[0]?.longitude).toBe(180);
    });
    test("a path without a crossing is one piece", () =>
      expect(splitAtAntimeridian(path([10, 0], [20, 1]))).toEqual([
        path([10, 0], [20, 1]),
      ]));
    test("a single point draws nothing", () =>
      expect(splitAtAntimeridian(path([0, 0]))).toEqual([]));
    test("a crossing on the last step leaves no one-point tail", () =>
      expect(
        splitAtAntimeridian(path([170, 0], [175, 0], [-175, 0])).map(
          (piece) => piece.length,
        ),
      ).toEqual([3, 2]));
  });
});
