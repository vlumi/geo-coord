import { latitudeToDD, longitudeToDD } from "../../convert.js";
import type { CoordSink } from "../../types.js";

const parseDDValues = (that: CoordSink, input: unknown[]): void => {
  const [lat, lon] = input;
  if (
    typeof lat === "number" &&
    lat >= -90 &&
    lat <= 90 &&
    typeof lon === "number" &&
    lon >= -180 &&
    lon <= 180
  ) {
    that.latitude = lat;
    that.longitude = lon;
    return;
  }
  throw new Error(`Invalid arguments: ${String(input)}`);
};

const parseDMSValues = (that: CoordSink, input: unknown[]): void => {
  const lat = { degrees: 0, minutes: 0, seconds: 0, hemisphere: "" };
  const lon = { degrees: 0, minutes: 0, seconds: 0, hemisphere: "" };
  let i = 0;
  let latitudeDone = false;
  let longitudeDone = false;
  // A hemisphere may lead its numbers ("N 35 40") or trail them ("35 40 N").
  // Leading: the letter is remembered and the component ends at the next
  // letter or at the end of the input. Trailing: the letter ends the component.
  let leading = false;

  const fail = (): never => {
    throw new Error(`Invalid arguments: ${String(input)}`);
  };

  for (const value of input) {
    if (longitudeDone || i > 3) fail();
    const target = latitudeDone ? lon : lat;
    switch (typeof value) {
      case "number":
        if (i > 2) fail();
        if (i === 0) target.degrees = value;
        else if (i === 1) target.minutes = value;
        else target.seconds = value;
        i++;
        break;
      case "string":
        if (i === 0 && target.hemisphere === "") {
          // Nothing read for this component yet: the letter leads it.
          target.hemisphere = value;
          leading = true;
        } else if (leading) {
          // This component was led by its letter; a new letter starts the next one.
          if (latitudeDone || i === 0) fail();
          latitudeDone = true;
          lon.hemisphere = value;
          i = 0;
        } else {
          // Trailing letter closes the component.
          if (i === 0) fail();
          target.hemisphere = value;
          if (latitudeDone) longitudeDone = true;
          else latitudeDone = true;
          i = 0;
        }
        break;
      default:
        fail();
    }
  }
  if (leading && (!latitudeDone || i === 0)) fail(); // a led component with no numbers
  if (!leading && !longitudeDone) fail();

  that.latitude = latitudeToDD(lat.degrees, lat.minutes, lat.seconds, lat.hemisphere);
  that.longitude = longitudeToDD(lon.degrees, lon.minutes, lon.seconds, lon.hemisphere);
};

/**
 * Numbers only, no hemisphere letters, split evenly into two components:
 * `-33 52 7 151 12 33` (DMS) or `-33 52.12 151 12.55` (DM). A negative
 * leading degree stands for south or west, as in signed decimal degrees.
 */
const parseSignedValues = (that: CoordSink, input: number[]): void => {
  const half = input.length / 2;
  const component = (values: number[], positive: string, negative: string): [number, number, number, string] => {
    const [degrees = 0, minutes = 0, seconds = 0] = values;
    const south = degrees < 0 || Object.is(degrees, -0);
    return [Math.abs(degrees), minutes, seconds, south ? negative : positive];
  };
  that.latitude = latitudeToDD(...component(input.slice(0, half), "N", "S"));
  that.longitude = longitudeToDD(...component(input.slice(half), "E", "W"));
};

const allNumbers = (input: unknown[]): input is number[] =>
  input.every((v) => typeof v === "number");

export default (that: CoordSink, ...input: unknown[]): void => {
  switch (input.length) {
    case 2:
      parseDDValues(that, input);
      break;
    case 4:
    case 6:
      if (allNumbers(input)) {
        parseSignedValues(that, input);
        break;
      }
      parseDMSValues(that, input);
      break;
    case 5:
    case 7:
    case 8:
      parseDMSValues(that, input);
      break;
    default:
      throw new Error(`Invalid arguments: ${String(input)}`);
  }
};
