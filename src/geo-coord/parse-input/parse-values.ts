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

export default (that: CoordSink, ...input: unknown[]): void => {
  switch (input.length) {
    case 2:
      parseDDValues(that, input);
      break;
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
      parseDMSValues(that, input);
      break;
    default:
      throw new Error(`Invalid arguments: ${String(input)}`);
  }
};
