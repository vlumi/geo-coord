import { describe, expect, test } from "vitest";
import { GeoCoord } from "../../../src/index.js";

const tokyo = "35.6812 139.7671";

describe("hemisphere before the number", () => {
  test.each([
    ["N35.6812 E139.7671", "glued, decimal"],
    ["N 35.6812 E 139.7671", "spaced, decimal"],
    ["N35.6812, E139.7671", "glued, with a comma"],
    ["N 35 40 52.32 E 139 46 1.56", "spaced DMS"],
    ["N35°40′52.32″ E139°46′1.56″", "glued DMS with symbols"],
  ])("%s (%s)", (input) => {
    expect(new GeoCoord(input).toDDString()).toBe(tokyo);
  });

  test("south and west", () => {
    expect(new GeoCoord("S33.8688 W151.2093").toDDString()).toBe("-33.8688 -151.2093");
  });

  test("glued trailing letters also work", () => {
    expect(new GeoCoord("35.6812N 139.7671E").toDDString()).toBe(tokyo);
    expect(new GeoCoord("35.6812N, 139.7671E").toDDString()).toBe(tokyo);
  });

  test("the existing trailing forms are unchanged", () => {
    expect(new GeoCoord("35.6812 N 139.7671 E").toDDString()).toBe(tokyo);
    expect(new GeoCoord("35°40′52.32″N 139°46′1.56″E").toDDString()).toBe(tokyo);
    expect(new GeoCoord("35.6812 139.7671").toDDString()).toBe(tokyo);
  });

  test.each([
    ["N E", "letters without numbers"],
    ["N35.6812 139.7671", "one component led, the other bare"],
    ["N35.6812 E", "second component without a number"],
    ["N35.6812 E139.7671 N", "a trailing letter after a led longitude"],
    ["35.6812 N E139.7671 S", "mixed leading and trailing with a stray letter"],
  ])("rejects %s (%s)", (input) => {
    expect(() => new GeoCoord(input)).toThrow(/Invalid arguments/);
  });
});
