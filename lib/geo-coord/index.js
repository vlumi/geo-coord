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
  roundToDegrees() {
    const round = (coord) => {
      const degrees = Math.round(
        coord.degrees + coord.minutes / 60 + coord.seconds / 3600
      );
      return { ...coord, degrees, minutes: 0, seconds: 0 };
    };
    return new GeoCoord(
      round(latitudeToDMS(this.latitude)),
      round(longitudeToDMS(this.longitude))
    );
  }
  roundToMinutes() {
    const round = (coord) => {
      const minutes = Math.round(coord.minutes + coord.seconds / 60);
      if (minutes < 60) {
        return { ...coord, minutes, seconds: 0 };
      }
      const degrees = coord.degrees + 1;
      return { ...coord, degrees, minutes: 0, seconds: 0 };
    };
    return new GeoCoord(
      round(latitudeToDMS(this.latitude)),
      round(longitudeToDMS(this.longitude))
    );
  }
  roundToSeconds() {
    const round = (coord) => {
      const seconds = Math.round(coord.seconds);
      if (seconds < 60) {
        return { ...coord, seconds };
      }
      const minutes = coord.minutes + 1;
      if (minutes < 60) {
        return { ...coord, minutes, seconds: 0 };
      }
      const degrees = coord.degrees + 1;
      return { ...coord, degrees, minutes: 0, seconds: 0 };
    };
    return new GeoCoord(
      round(latitudeToDMS(this.latitude)),
      round(longitudeToDMS(this.longitude))
    );
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
