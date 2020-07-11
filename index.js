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
  toDMSH() {
    return {
      latitude: latitudeToDMSH(this.latitude),
      longitude: longitudeToDMSH(this.longitude),
    };
  }
  toString() {
    const coords = this.toDMSH();
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

const latitudeToDecimal = (degrees, minutes, seconds, hemisphere) => {
  if (["N", "S"].indexOf(hemisphere) < 0) {
    throw `Invalid latitude hemisphere value: ${hemisphere}`;
  }
  if (degrees < 0 || degrees > 90) {
    throw `Latitude degrees outside of range: ${degrees}`;
  }
  if (minutes < 0 || minutes >= 60) {
    throw `Latitude minutes outside of range: ${minutes}`;
  }
  if (seconds < 0 || seconds >= 60) {
    throw `Latitude minutes outside of range: ${minutes}`;
  }
  if (degrees === 90 && (minutes > 0 || seconds > 0)) {
    throw `Latitude exceeds 180 degrees: ${degrees}° ${minutes}′ ${seconds}″ ${hemisphere}`;
  }
  return convertToDecimal(degrees, minutes, seconds, hemisphere === "S");
};
const latitudeToDMSH = (decimalDegrees) => {
  // TODO: input check
  const sign = Math.sign(decimalDegrees);
  const absDegrees = Math.abs(decimalDegrees);
  const degrees = Math.floor(absDegrees);
  const minutes = Math.floor(60 * (absDegrees - degrees));
  const seconds = Math.round(3600 * (absDegrees - degrees) - 60 * minutes);
  const hemisphere = Object.is(sign, 0) || sign > 0 ? "N" : "S";
  return {
    degrees,
    minutes,
    seconds,
    hemisphere,
  };
};
const longitudeToDecimal = (degrees, minutes, seconds, hemisphere) => {
  if (["E", "W"].indexOf(hemisphere) < 0) {
    throw `Invalid longitude hemisphere value: ${hemisphere}`;
  }
  if (degrees < 0 || degrees > 180) {
    throw `Longitude degrees outside of range: ${degrees}`;
  }
  if (minutes < 0 || minutes >= 60) {
    throw `Longitude minutes outside of range: ${minutes}`;
  }
  if (seconds < 0 || seconds >= 60) {
    throw `Longitude seconds outside of range: ${seconds}`;
  }
  if (degrees === 180 && (minutes > 0 || seconds > 0)) {
    throw `Longitude exceeds 180 degrees: ${degrees}° ${minutes}′ ${seconds}″ ${hemisphere}`;
  }
  return convertToDecimal(degrees, minutes, seconds, hemisphere === "W");
};
const longitudeToDMSH = (decimalDegrees) => {
  // TODO: input check
  const sign = Math.sign(decimalDegrees);
  const absDegrees = Math.abs(decimalDegrees);
  const degrees = Math.floor(absDegrees);
  const minutes = Math.floor(60 * (absDegrees - degrees));
  const seconds = Math.round(3600 * (absDegrees - degrees) - 60 * minutes);
  const hemisphere = Object.is(sign, 0) || sign > 0 ? "E" : "W";
  return {
    degrees,
    minutes,
    seconds,
    hemisphere,
  };
};

const convertToDecimal = (degrees, minutes, seconds, negative) => {
  return (negative ? -1 : 1) * (degrees + minutes / 60 + seconds / 3600);
};

module.exports = {
  GeoCoord,

  latitudeToDecimal,
  latitudeToDMSH,
  longitudeToDecimal,
  longitudeToDMSH,
};
