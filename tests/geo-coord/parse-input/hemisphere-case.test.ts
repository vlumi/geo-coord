import { describe, expect, test } from "vitest";
import { formatCoordinates, parseCoordinates, tryParseCoordinates } from "../../../src/index.js";

const santiago = { latitude: -33.8688, longitude: -70.6483 };
const tokyo = { latitude: 35.6812, longitude: 139.7671 };

describe("hemisphere letters in either case (#38)", () => {
  test("lowercase letters after the numbers", () => {
    expect(tryParseCoordinates("33.8688°s 70.6483°w")).toEqual(santiago);
    expect(parseCoordinates("33.8688 s, 70.6483 w")).toEqual(santiago);
  });
  test("lowercase letters before the numbers, glued or spaced", () => {
    expect(parseCoordinates("n35.6812 e139.7671")).toEqual(tokyo);
    expect(parseCoordinates("s 33.8688 w 70.6483")).toEqual(santiago);
  });
  test("mixed with DMS symbols", () => {
    expect(parseCoordinates("35°40′52.32″n 139°46′1.56″e").latitude).toBeCloseTo(35.6812, 9);
  });
  test("a lowercase letter inside another word is not a hemisphere", () => {
    expect(tryParseCoordinates("sydney")).toBeNull();
    expect(tryParseCoordinates("35.6812 news 139.7671")).toEqual(tokyo); // "news" is a separator, as before
  });
});

describe("hemisphere words", () => {
  test("English, any case", () => {
    expect(parseCoordinates("33.8688 South 70.6483 West")).toEqual(santiago);
    expect(parseCoordinates("NORTH 35.6812 EAST 139.7671")).toEqual(tokyo);
    expect(parseCoordinates("35.6812 north, 139.7671 east")).toEqual(tokyo);
  });
  test("Japanese, as formatCoordinates writes it", () => {
    const text = formatCoordinates(tokyo, {
      style: "dms",
      precision: 2,
      hemispheres: { N: "北緯", S: "南緯", E: "東経", W: "西経" },
      hemispherePosition: "before",
      symbols: { degrees: "度", minutes: "分", seconds: "秒" },
    });
    expect(text).toBe("北緯35度40分52.32秒 東経139度46分1.56秒");
    const back = parseCoordinates(text);
    expect(back.latitude).toBeCloseTo(35.6812, 6);
    expect(back.longitude).toBeCloseTo(139.7671, 6);
    expect(parseCoordinates("南緯33.8688度 西経70.6483度")).toEqual(santiago);
  });
  test("Finnish and German", () => {
    expect(parseCoordinates("60.1699 pohjoista 24.9384 itäistä")).toEqual({ latitude: 60.1699, longitude: 24.9384 });
    expect(parseCoordinates("52.52 Nord 13.405 Ost")).toEqual({ latitude: 52.52, longitude: 13.405 });
  });
});
