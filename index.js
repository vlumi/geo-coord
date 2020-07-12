const { GeoCoord } = require("./lib/geo-coord");
const {
  latitudeToDecimal,
  latitudeToDMSH,
  longitudeToDecimal,
  longitudeToDMSH,
} = require("./lib/convert");

module.exports = {
  GeoCoord,

  latitudeToDecimal,
  latitudeToDMSH,
  longitudeToDecimal,
  longitudeToDMSH,
};
