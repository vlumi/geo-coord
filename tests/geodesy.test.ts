import { describe, expect, test } from "vitest";
import {
  MEAN_EARTH_RADIUS_KM,
  destination,
  distanceKm,
  finalBearing,
  initialBearing,
  interpolate,
  midpoint,
} from "../src/geodesy.js";

const origin = { latitude: 0, longitude: 0 };
const quarterEast = { latitude: 0, longitude: 90 };
const helsinki = { latitude: 60.1699, longitude: 24.9384 };
const tokyo = { latitude: 35.6762, longitude: 139.6503 };

const closeTo = (
  point: { latitude: number; longitude: number },
  expected: { latitude: number; longitude: number },
): void => {
  expect(point.latitude).toBeCloseTo(expected.latitude, 6);
  expect(point.longitude).toBeCloseTo(expected.longitude, 6);
};

describe("Geodesy", () => {
  describe("distanceKm", () => {
    test("a quarter of the equator", () =>
      expect(distanceKm(origin, quarterEast)).toBeCloseTo(
        (MEAN_EARTH_RADIUS_KM * Math.PI) / 2,
        6,
      ));
    test("pole to pole", () =>
      expect(
        distanceKm(
          { latitude: 90, longitude: 0 },
          { latitude: -90, longitude: 0 },
        ),
      ).toBeCloseTo(MEAN_EARTH_RADIUS_KM * Math.PI, 6));
    test("zero for the same point", () =>
      expect(distanceKm(helsinki, helsinki)).toBe(0));
    test("symmetric", () =>
      expect(distanceKm(helsinki, tokyo)).toBeCloseTo(
        distanceKm(tokyo, helsinki),
        9,
      ));
    test("the unit sphere gives the central angle", () =>
      expect(distanceKm(origin, quarterEast, { radiusKm: 1 })).toBeCloseTo(
        Math.PI / 2,
        9,
      ));
    test("Helsinki to Tokyo is about 7 800 km", () =>
      expect(distanceKm(helsinki, tokyo)).toBeCloseTo(7818, -1));
  });

  describe("initialBearing", () => {
    test("east along the equator", () =>
      expect(initialBearing(origin, quarterEast)).toBeCloseTo(90, 9));
    test("north", () =>
      expect(initialBearing(origin, { latitude: 10, longitude: 0 })).toBe(0));
    test("south", () =>
      expect(initialBearing(origin, { latitude: -10, longitude: 0 })).toBe(180));
    test("west", () =>
      expect(initialBearing(origin, { latitude: 0, longitude: -10 })).toBe(270));
    test("Helsinki to Tokyo leaves north-east, over the pole side", () => {
      const bearing = initialBearing(helsinki, tokyo);
      expect(bearing).toBeGreaterThan(30);
      expect(bearing).toBeLessThan(60);
    });
  });

  describe("finalBearing", () => {
    test("east along the equator stays east", () =>
      expect(finalBearing(origin, quarterEast)).toBeCloseTo(90, 9));
    test("Helsinki to Tokyo arrives heading south-east", () => {
      const bearing = finalBearing(helsinki, tokyo);
      expect(bearing).toBeGreaterThan(120);
      expect(bearing).toBeLessThan(160);
    });
  });

  describe("destination", () => {
    test("a quarter turn east along the equator", () =>
      closeTo(
        destination(origin, 90, (MEAN_EARTH_RADIUS_KM * Math.PI) / 2),
        quarterEast,
      ));
    test("north to the pole", () =>
      expect(
        destination(origin, 0, (MEAN_EARTH_RADIUS_KM * Math.PI) / 2).latitude,
      ).toBeCloseTo(90, 6));
    test("bearing and distance take you there", () =>
      closeTo(
        destination(
          helsinki,
          initialBearing(helsinki, tokyo),
          distanceKm(helsinki, tokyo),
        ),
        tokyo,
      ));
    test("longitude wraps into [-180, 180)", () => {
      const point = destination(
        { latitude: 0, longitude: 170 },
        90,
        (MEAN_EARTH_RADIUS_KM * Math.PI) / 9,
      );
      expect(point.longitude).toBeCloseTo(-170, 6);
    });
    test("the radius scales the reach", () =>
      closeTo(destination(origin, 90, Math.PI / 2, { radiusKm: 1 }), quarterEast));
  });

  describe("interpolate", () => {
    test("0 is the start", () => closeTo(interpolate(helsinki, tokyo, 0), helsinki));
    test("1 is the end", () => closeTo(interpolate(helsinki, tokyo, 1), tokyo));
    test("the same point stays put", () =>
      expect(interpolate(helsinki, helsinki, 0.3)).toEqual(helsinki));
    test("halfway along the equator", () =>
      closeTo(interpolate(origin, quarterEast, 0.5), {
        latitude: 0,
        longitude: 45,
      }));
    test("2 extrapolates past the end", () =>
      closeTo(interpolate(origin, quarterEast, 2), {
        latitude: 0,
        longitude: -180,
      }));
    test("the halfway point is equidistant", () => {
      const half = interpolate(helsinki, tokyo, 0.5);
      expect(distanceKm(helsinki, half)).toBeCloseTo(distanceKm(half, tokyo), 6);
    });
  });

  describe("midpoint", () => {
    test("along the equator", () =>
      closeTo(midpoint(origin, quarterEast), { latitude: 0, longitude: 45 }));
    test("across the antimeridian", () =>
      closeTo(
        midpoint(
          { latitude: 0, longitude: 170 },
          { latitude: 0, longitude: -170 },
        ),
        { latitude: 0, longitude: -180 },
      ));
    test("symmetric", () =>
      closeTo(midpoint(helsinki, tokyo), midpoint(tokyo, helsinki)));
  });
});
