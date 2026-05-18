import { latitudeToDD, longitudeToDD } from "../../convert.js";
import type { CoordSink } from "../../types.js";

type DMSLike = {
  degrees?: number;
  minutes?: number;
  seconds?: number;
  hemisphere?: string;
};

type ToDD = (
  degrees: number,
  minutes: number,
  seconds: number,
  hemisphere: string,
) => number;

const parsePart = (input: DMSLike, toDD: ToDD): number =>
  toDD(
    input.degrees ?? 0,
    input.minutes ?? 0,
    input.seconds ?? 0,
    input.hemisphere ?? "",
  );

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

export default (that: CoordSink, input: unknown): void => {
  if (!isObject(input) || !("latitude" in input) || !("longitude" in input)) {
    throw new Error(`Invalid arguments: ${String(input)}`);
  }
  const { latitude, longitude } = input;
  if (isObject(latitude) && isObject(longitude)) {
    that.latitude = parsePart(latitude as DMSLike, latitudeToDD);
    that.longitude = parsePart(longitude as DMSLike, longitudeToDD);
    return;
  }
  if (typeof latitude === "number" && typeof longitude === "number") {
    that.latitude = latitude;
    that.longitude = longitude;
    return;
  }
  throw new Error(`Invalid arguments: ${String(input)}`);
};
