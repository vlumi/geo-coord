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
  distanceTo() {
    // TODO: parameter (that)
    // TODO: implement -- big circle distance between the two points, and the direction from this to that
    throw "Not implemented";
  }
  distanceFrom(that) {
    return that.distanceTo(this);
  }
  transform() {
    // TODO: parameters (distance, direction)
    throw "Not implemented";
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
