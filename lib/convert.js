const latitudeToDD = (degrees, minutes, seconds, hemisphere) => {
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
    throw `Latitude exceeds 90 degrees: ${degrees}° ${minutes}′ ${seconds}″ ${hemisphere}`;
  }
  return convertToDD(degrees, minutes, seconds, hemisphere === "S");
};
const latitudeToDMS = (dd) => {
  if (dd < -90 || dd > 90) {
    throw `Invalid longitude: ${dd}`;
  }
  const sign = Math.sign(dd);
  const absDegrees = Math.abs(dd);
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
const longitudeToDD = (degrees, minutes, seconds, hemisphere) => {
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
  return convertToDD(degrees, minutes, seconds, hemisphere === "W");
};
const longitudeToDMS = (dd) => {
  if (dd < -180 || dd > 180) {
    throw `Invalid longitude: ${dd}`;
  }
  const sign = Math.sign(dd);
  const absDegrees = Math.abs(dd);
  const degrees = Math.floor(round(absDegrees));
  const minutes = Math.abs(Math.floor(round(60 * (absDegrees - degrees))));
  const seconds = Math.abs(round(3600 * (absDegrees - degrees) - 60 * minutes));
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

const convertToDD = (degrees, minutes, seconds, negative) => {
  return (negative ? -1 : 1) * (degrees + minutes / 60 + seconds / 3600);
};

module.exports = {
  latitudeToDD,
  latitudeToDMS,
  longitudeToDD,
  longitudeToDMS,
};
