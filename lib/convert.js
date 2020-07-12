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
  if (decimalDegrees < -90 || decimalDegrees > 90) {
    throw `Invalid longitude: ${decimalDegrees}`;
  }
  const sign = Math.sign(decimalDegrees);
  const absDegrees = Math.abs(decimalDegrees);
  const degrees = Math.floor(round(absDegrees));
  const minutes = Math.floor(round(60 * (absDegrees - degrees)));
  const seconds = round(3600 * (absDegrees - degrees) - 60 * minutes);
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
  if (decimalDegrees < -180 || decimalDegrees > 180) {
    throw `Invalid longitude: ${decimalDegrees}`;
  }
  const sign = Math.sign(decimalDegrees);
  const absDegrees = Math.abs(decimalDegrees);
  const degrees = Math.floor(round(absDegrees));
  const minutes = Math.floor(round(60 * (absDegrees - degrees)));
  const seconds = round(3600 * (absDegrees - degrees) - 60 * minutes);
  const hemisphere = Object.is(sign, 0) || sign > 0 ? "E" : "W";
  return {
    degrees,
    minutes,
    seconds,
    hemisphere,
  };
};
const round = (num) => {
  const PRECISION = 10 ** 9;
  return Math.round(num * PRECISION) / PRECISION;
};

const convertToDecimal = (degrees, minutes, seconds, negative) => {
  return (negative ? -1 : 1) * (degrees + minutes / 60 + seconds / 3600);
};

module.exports = {
  latitudeToDecimal,
  latitudeToDMSH,
  longitudeToDecimal,
  longitudeToDMSH,
};
