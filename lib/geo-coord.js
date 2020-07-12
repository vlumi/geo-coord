const {
  latitudeToDecimal,
  latitudeToDMS,
  longitudeToDecimal,
  longitudeToDMS,
} = require("./convert");

const parsePartObject = (that, input, key, toDecimal) => {
  that[key] = toDecimal(
    input[key].degrees || 0,
    input[key].minutes || 0,
    input[key].seconds || 0,
    input[key].hemisphere
  );
};
const parseInputObject = (that, input) => {
  if ("latitude" in input && "longitude" in input) {
    if (
      typeof input.latitude === "object" &&
      typeof input.longitude === "object"
    ) {
      parsePartObject(that, input, "latitude", latitudeToDecimal);
      parsePartObject(that, input, "longitude", longitudeToDecimal);
      return;
    }
    if (
      typeof input.latitude === "number" &&
      typeof input.longitude === "number"
    ) {
      that.latitude = input.latitude;
      that.longitude = input.longitude;
      return;
    }
  }
  throw `Invalid arguments: ${input}`;
};
const parseInputString = () => {
  throw "String parsing not yet implemented.";
};

class GeoCoord {
  constructor(...input) {
    switch (input.length) {
      case 1:
        // Single object
        if (typeof input[0] === "object") {
          parseInputObject(this, input[0]);
        } else if (typeof input[0] === "string") {
          parseInputString(this, input[0]);
        } else {
          throw `Invalid arguments: ${input}`;
        }
        break;
      case 2:
        // Latitude and longitude
        if (typeof input[0] === "object" && typeof input[1] === "object") {
          parseInputObject(this, { latitude: input[0], longitude: input[1] });
        } else if (
          typeof input[0] === "number" &&
          typeof input[1] === "number"
        ) {
          this.latitude = input[0];
          this.longitude = input[1];
        }
        break;
      case 0:
      default:
        throw `Invalid arguments: ${input}`;
    }
  }
  toDecimal() {
    return {
      latitude: this.latitude,
      longitude: this.longitude,
    };
  }
  toDMS() {
    return {
      latitude: latitudeToDMS(this.latitude),
      longitude: longitudeToDMS(this.longitude),
    };
  }
  toString() {
    const coords = this.toDMS();
    return (
      `${coords.latitude.degrees}°` +
      `${coords.latitude.minutes}′` +
      `${coords.latitude.seconds}″` +
      `${coords.latitude.hemisphere}` +
      " " +
      `${coords.longitude.degrees}°` +
      `${coords.longitude.minutes}′` +
      `${coords.longitude.seconds}″` +
      `${coords.longitude.hemisphere}`
    );
  }
}

module.exports = {
  GeoCoord,
};
