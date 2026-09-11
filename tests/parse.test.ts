import { describe, expect, test } from "vitest";
import {
  fromLonLat,
  isValidLatitude,
  isValidLongitude,
  parseCoordinates,
  toLonLat,
  tryParseCoordinates,
} from "../src/index.js";

const tokyo = { latitude: 35.6812, longitude: 139.7671 };

describe("parseCoordinates", () => {
  test("a string in any notation", () => {
    expect(parseCoordinates("35.6812, 139.7671")).toEqual(tokyo);
    expect(parseCoordinates("N35.6812 E139.7671")).toEqual(tokyo);
    expect(parseCoordinates("35°40′52.32″N 139°46′1.56″E").latitude).toBeCloseTo(35.6812, 9);
  });
  test("objects and separate values, like the class", () => {
    expect(parseCoordinates({ latitude: 35.6812, longitude: 139.7671 })).toEqual(tokyo);
    expect(parseCoordinates(35.6812, 139.7671)).toEqual(tokyo);
    expect(parseCoordinates(35, 40, 52.32, "N", 139, 46, 1.56, "E").longitude).toBeCloseTo(139.7671, 9);
  });
  test("throws on what it cannot read, naming the text as typed", () => {
    expect(() => parseCoordinates("Tokyo")).toThrow('Invalid arguments: no coordinates in "Tokyo"');
    expect(() => parseCoordinates("")).toThrow('no coordinates in ""');
    expect(() => parseCoordinates("N35.6812 139.7671")).toThrow(/^Invalid arguments: "N35\.6812 139\.7671" \(/);
    expect(() => parseCoordinates("95, 0")).toThrow(/"95, 0" \(.*95/);
    expect(() => parseCoordinates(95, 0)).toThrow(/Invalid arguments/);
  });
});

describe("tryParseCoordinates", () => {
  test("null instead of throwing", () => {
    expect(tryParseCoordinates("Tokyo")).toBeNull();
    expect(tryParseCoordinates("")).toBeNull();
    expect(tryParseCoordinates("35.6812, 139.7671")).toEqual(tokyo);
  });
});

describe("geo URIs", () => {
  test("the two coordinates, with or without altitude and parameters", () => {
    expect(parseCoordinates("geo:35.6812,139.7671")).toEqual(tokyo);
    expect(parseCoordinates("geo:35.6812,139.7671,40")).toEqual(tokyo);
    expect(parseCoordinates("geo:35.6812,139.7671;u=35")).toEqual(tokyo);
    expect(parseCoordinates("GEO:-33.8688,151.2093,0;crs=wgs84;u=10")).toEqual({ latitude: -33.8688, longitude: 151.2093 });
    expect(parseCoordinates("  geo:35.6812, 139.7671 ")).toEqual(tokyo);
  });
  test("still range-checked", () => {
    expect(() => parseCoordinates("geo:95,0")).toThrow();
  });
});

describe("signed DMS and DM without hemisphere letters", () => {
  test("six numbers are two DMS groups, the sign of the degrees choosing the hemisphere", () => {
    const c = parseCoordinates("-33 52 7.68 151 12 33.48");
    expect(c.latitude).toBeCloseTo(-33.8688, 9);
    expect(c.longitude).toBeCloseTo(151.2093, 9);
  });
  test("four numbers are two DM groups", () => {
    const c = parseCoordinates("35 40.872 -139 46.026");
    expect(c.latitude).toBeCloseTo(35.6812, 9);
    expect(c.longitude).toBeCloseTo(-139.7671, 9);
  });
  test("a negative zero degree still means south or west", () => {
    expect(parseCoordinates("-0 30 -0 30")).toEqual({ latitude: -0.5, longitude: -0.5 });
  });
  test("letters still win when present", () => {
    expect(parseCoordinates("33 52 7.68 S 151 12 33.48 E").latitude).toBeCloseTo(-33.8688, 9);
  });
  test("out-of-range groups are rejected", () => {
    expect(() => parseCoordinates("91 0 0 0 0 0")).toThrow();
    expect(() => parseCoordinates("0 60 0 0")).toThrow();
  });
});

describe("lon/lat tuples and validity", () => {
  test("fromLonLat and toLonLat swap the order", () => {
    expect(fromLonLat([139.7671, 35.6812])).toEqual(tokyo);
    expect(toLonLat(tokyo)).toEqual([139.7671, 35.6812]);
  });
  test("isValidLatitude / isValidLongitude", () => {
    expect(isValidLatitude(90)).toBe(true);
    expect(isValidLatitude(-90.0001)).toBe(false);
    expect(isValidLatitude(Number.NaN)).toBe(false);
    expect(isValidLongitude(180)).toBe(true);
    expect(isValidLongitude(180.5)).toBe(false);
    expect(isValidLongitude(Number.POSITIVE_INFINITY)).toBe(false);
  });
});
