import { describe, expect, test } from "vitest";
import fc from "fast-check";
import {
  destination,
  distanceKm,
  formatCoordinates,
  initialBearing,
  midpoint,
  normalizeLongitude,
  parseCoordinates,
  unwrapPath,
} from "../src/index.js";

const latitude = fc.double({ min: -90, max: 90, noNaN: true, noDefaultInfinity: true });
const longitude = fc.double({ min: -180, max: 180, noNaN: true, noDefaultInfinity: true });
const point = fc.record({ latitude, longitude });
const bearing = fc.double({ min: 0, max: 360, noNaN: true, noDefaultInfinity: true });

describe("properties: format and parse round-trip", () => {
  test("decimal style, at any precision from 4 up", () =>
    fc.assert(
      fc.property(point, fc.integer({ min: 4, max: 9 }), (p, precision) => {
        const back = parseCoordinates(formatCoordinates(p, { precision }));
        const tolerance = 0.5 * 10 ** -precision + 1e-12;
        expect(Math.abs(back.latitude - p.latitude)).toBeLessThanOrEqual(tolerance);
        expect(Math.abs(back.longitude - p.longitude)).toBeLessThanOrEqual(tolerance);
      }),
    ));

  test("DMS style, seconds to any precision", () =>
    fc.assert(
      fc.property(point, fc.integer({ min: 0, max: 4 }), (p, precision) => {
        const back = parseCoordinates(formatCoordinates(p, { style: "dms", precision }));
        const tolerance = (0.5 * 10 ** -precision) / 3600 + 1e-9;
        expect(Math.abs(back.latitude - p.latitude)).toBeLessThanOrEqual(tolerance);
        expect(Math.abs(back.longitude - p.longitude)).toBeLessThanOrEqual(tolerance);
      }),
    ));

  test("signed style with a comma separator", () =>
    fc.assert(
      fc.property(point, (p) => {
        const text = formatCoordinates(p, { hemisphere: "sign", precision: 6, separator: ", " });
        const back = parseCoordinates(text);
        expect(Math.abs(back.latitude - p.latitude)).toBeLessThanOrEqual(0.5e-6 + 1e-12);
        expect(Math.abs(back.longitude - p.longitude)).toBeLessThanOrEqual(0.5e-6 + 1e-12);
      }),
    ));

  test("hemisphere letters before the numbers", () =>
    fc.assert(
      fc.property(point, (p) => {
        const text = formatCoordinates(p, { hemispherePosition: "before", precision: 6 });
        const back = parseCoordinates(text);
        expect(Math.abs(back.latitude - p.latitude)).toBeLessThanOrEqual(0.5e-6 + 1e-12);
        expect(Math.abs(back.longitude - p.longitude)).toBeLessThanOrEqual(0.5e-6 + 1e-12);
      }),
    ));
});

describe("properties: geodesy", () => {
  test("distance is symmetric, zero to itself, never negative", () =>
    fc.assert(
      fc.property(point, point, (a, b) => {
        expect(distanceKm(a, b)).toBeCloseTo(distanceKm(b, a), 6);
        expect(distanceKm(a, a)).toBeCloseTo(0, 6);
        expect(distanceKm(a, b)).toBeGreaterThanOrEqual(0);
      }),
    ));

  test("destination lands the requested distance away", () =>
    fc.assert(
      fc.property(
        fc.record({ latitude: fc.double({ min: -80, max: 80, noNaN: true, noDefaultInfinity: true }), longitude }),
        bearing,
        fc.double({ min: 0, max: 5000, noNaN: true, noDefaultInfinity: true }),
        (from, brg, km) => {
          const to = destination(from, brg, km);
          expect(distanceKm(from, to)).toBeCloseTo(km, 5);
          expect(to.longitude).toBeGreaterThanOrEqual(-180);
          expect(to.longitude).toBeLessThan(180);
        },
      ),
    ));

  test("the midpoint is equidistant, and on the way", () =>
    fc.assert(
      fc.property(point, point, (a, b) => {
        fc.pre(distanceKm(a, b) > 1 && distanceKm(a, b) < 19000);
        const m = midpoint(a, b);
        expect(distanceKm(a, m)).toBeCloseTo(distanceKm(m, b), 4);
        expect(distanceKm(a, m) + distanceKm(m, b)).toBeCloseTo(distanceKm(a, b), 4);
      }),
    ));

  test("bearings are in [0, 360)", () =>
    fc.assert(
      fc.property(point, point, (a, b) => {
        const θ = initialBearing(a, b);
        expect(θ).toBeGreaterThanOrEqual(0);
        expect(θ).toBeLessThan(360);
      }),
    ));
});

describe("properties: longitude", () => {
  test("normalizeLongitude lands in [-180, 180) and keeps the direction", () =>
    fc.assert(
      fc.property(fc.double({ min: -100000, max: 100000, noNaN: true, noDefaultInfinity: true }), (λ) => {
        const n = normalizeLongitude(λ);
        expect(n).toBeGreaterThanOrEqual(-180);
        expect(n).toBeLessThan(180);
        expect(((λ - n) / 360) % 1).toBeCloseTo(0, 6);
      }),
    ));

  test("an unwrapped path never jumps more than 180° between neighbours", () =>
    fc.assert(
      fc.property(fc.array(point, { minLength: 2, maxLength: 30 }), (path) => {
        const u = unwrapPath(path);
        for (let i = 1; i < u.length; i++) {
          expect(Math.abs((u[i] as { longitude: number }).longitude - (u[i - 1] as { longitude: number }).longitude)).toBeLessThanOrEqual(180);
        }
      }),
    ));
});
