const { latitudeToDD, longitudeToDD } = require("../../convert");

const parsePart = (that, input, key, toDD) => {
  that[key] = toDD(
    input[key].degrees || 0,
    input[key].minutes || 0,
    input[key].seconds || 0,
    input[key].hemisphere
  );
};
module.exports = (that, input) => {
  if ("latitude" in input && "longitude" in input) {
    if (
      typeof input.latitude === "object" &&
      typeof input.longitude === "object"
    ) {
      parsePart(that, input, "latitude", latitudeToDD);
      parsePart(that, input, "longitude", longitudeToDD);
      return;
    } else if (
      typeof input.latitude === "number" &&
      typeof input.longitude === "number"
    ) {
      that.latitude = input.latitude;
      that.longitude = input.longitude;
      return;
    } else {
      throw `Invalid arguments: ${input}`;
    }
  }
  throw `Invalid arguments: ${input}`;
};
