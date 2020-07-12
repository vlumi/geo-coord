const { GeoCoord } = require("./lib/geo-coord");
const {
  latitudeToDD,
  latitudeToDMS,
  longitudeToDD,
  longitudeToDMS,
} = require("./lib/convert");

module.exports = {
  GeoCoord,

  latitudeToDD,
  latitudeToDMS,
  longitudeToDD,
  longitudeToDMS,
};
