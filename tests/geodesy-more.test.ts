import { describe, expect, test } from "vitest";
import {
  MEAN_EARTH_RADIUS_KM,
  alongTrackDistanceKm,
  boundingBox,
  crossTrackDistanceKm,
  destination,
  distanceKm,
  inBoundingBox,
} from "../src/geodesy.js";

const origin = { latitude: 0, longitude: 0 };
const east10 = { latitude: 0, longitude: 10 };
const helsinki = { latitude: 60.1699, longitude: 24.9384 };
const tokyo = { latitude: 35.6812, longitude: 139.7671 };
const kmPerDegree = (MEAN_EARTH_RADIUS_KM * Math.PI) / 180;

describe("crossTrackDistanceKm", () => {
  test("a point on the path is at zero", () =>
    expect(crossTrackDistanceKm({ latitude: 0, longitude: 5 }, origin, east10)).toBeCloseTo(0, 6));
  test("north of an eastward equatorial path is left, negative", () =>
    expect(crossTrackDistanceKm({ latitude: 1, longitude: 5 }, origin, east10)).toBeCloseTo(-kmPerDegree, 3));
  test("south of it is right, positive", () =>
    expect(crossTrackDistanceKm({ latitude: -1, longitude: 5 }, origin, east10)).toBeCloseTo(kmPerDegree, 3));
  test("takes the radius option", () =>
    expect(crossTrackDistanceKm({ latitude: 1, longitude: 5 }, origin, east10, { radiusKm: 1000 })).toBeCloseTo(-(1000 * Math.PI) / 180, 6));
});

describe("alongTrackDistanceKm", () => {
  test("halfway along the equator", () =>
    expect(alongTrackDistanceKm({ latitude: 1, longitude: 5 }, origin, east10)).toBeCloseTo(5 * kmPerDegree, 0));
  test("behind the start is negative", () =>
    expect(alongTrackDistanceKm({ latitude: 0, longitude: -3 }, origin, east10)).toBeCloseTo(-3 * kmPerDegree, 3));
  test("beyond the end keeps counting", () =>
    expect(alongTrackDistanceKm({ latitude: 0, longitude: 14 }, origin, east10)).toBeCloseTo(14 * kmPerDegree, 3));
  test("the start itself is at zero", () =>
    expect(alongTrackDistanceKm(origin, origin, east10)).toBeCloseTo(0, 6));
});

describe("boundingBox", () => {
  test("is symmetric around a point on the equator", () => {
    const box = boundingBox(origin, kmPerDegree);
    expect(box.south).toBeCloseTo(-1, 6);
    expect(box.north).toBeCloseTo(1, 6);
    expect(box.west).toBeCloseTo(-1, 6);
    expect(box.east).toBeCloseTo(1, 6);
  });
  test("widens in longitude at high latitude", () => {
    const box = boundingBox(helsinki, 100);
    expect(box.north - box.south).toBeCloseTo(2 * (100 / kmPerDegree), 6);
    expect(box.east - box.west).toBeGreaterThan(2 * (100 / kmPerDegree) * 1.9);
  });
  test("contains exactly the points within the radius, on its edges", () => {
    const box = boundingBox(tokyo, 250);
    for (const bearing of [0, 45, 90, 135, 180, 225, 270, 315]) {
      expect(inBoundingBox(destination(tokyo, bearing, 249.9), box)).toBe(true);
    }
    expect(inBoundingBox(destination(tokyo, 0, 260), box)).toBe(false);
    expect(inBoundingBox(destination(tokyo, 90, 260), box)).toBe(false);
  });
  test("wraps the antimeridian", () => {
    const box = boundingBox({ latitude: 0, longitude: 179.5 }, 2 * kmPerDegree);
    expect(box.west).toBeGreaterThan(box.east);
    expect(inBoundingBox({ latitude: 0, longitude: -179.8 }, box)).toBe(true);
    expect(inBoundingBox({ latitude: 0, longitude: 178 }, box)).toBe(true);
    expect(inBoundingBox({ latitude: 0, longitude: 170 }, box)).toBe(false);
  });
  test("reaches the pole and spans all longitudes when the pole is inside", () => {
    const box = boundingBox({ latitude: 89, longitude: 0 }, 2 * kmPerDegree);
    expect(box.north).toBe(90);
    expect(box.west).toBe(-180);
    expect(box.east).toBe(180);
    expect(inBoundingBox({ latitude: 89.5, longitude: 180 }, box)).toBe(true);
  });
  test("a prefilter never excludes a point inside the radius", () => {
    const box = boundingBox(helsinki, 500);
    for (let bearing = 0; bearing < 360; bearing += 7) {
      for (const d of [1, 100, 250, 499]) {
        const p = destination(helsinki, bearing, d);
        expect(distanceKm(helsinki, p)).toBeLessThanOrEqual(500.001);
        expect(inBoundingBox(p, box)).toBe(true);
      }
    }
  });
});
