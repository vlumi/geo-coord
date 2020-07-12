const { latitudeToDMS, longitudeToDMS } = require("../convert");

const parseInput = require("./parse-input");

class GeoCoord {
  constructor(...input) {
    parseInput(this, ...input);
  }
  toDD() {
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
