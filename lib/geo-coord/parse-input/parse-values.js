const { latitudeToDD, longitudeToDD } = require("../../convert");

const parseDDValues = (that, input) => {
  if (
    typeof input[0] === "number" &&
    input[0] >= -90 &&
    input[0] <= 90 &&
    typeof input[1] === "number" &&
    input[1] >= -180 &&
    input[1] <= 180
  ) {
    that.latitude = input[0];
    that.longitude = input[1];
  } else {
    throw `Invalid arguments: ${input}`;
  }
};

const parseDMSValues = (that, input) => {
  const iterateValues = (input) => {
    const result = {
      latitude: [0, 0, 0, ""],
      longitude: [0, 0, 0, ""],
    };
    let i = 0;
    let latitudeDone = false;
    let longitudeDone = false;
    input.forEach((value) => {
      if (longitudeDone || i > 3) {
        throw `Invalid arguments: ${input}`;
      }
      switch (typeof value) {
        case "number":
          if (i > 2) {
            throw `Invalid arguments: ${input}`;
          }
          if (!latitudeDone) {
            result.latitude[i] = value;
          } else {
            result.longitude[i] = value;
          }
          i++;
          break;
        case "string":
          if (!latitudeDone) {
            result.latitude[3] = value;
            latitudeDone = true;
          } else {
            result.longitude[3] = value;
            longitudeDone = true;
          }
          i = 0;
          break;
        default:
          throw `Invalid arguments: ${input}`;
      }
    });
    return result;
  };
  const coordinates = iterateValues(input);
  that.latitude = latitudeToDD(...coordinates.latitude);
  that.longitude = longitudeToDD(...coordinates.longitude);
};

module.exports = (that, ...input) => {
  switch (input.length) {
    case 2:
      parseDDValues(that, input);
      break;
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
      parseDMSValues(that, input);
      break;
    default:
      throw `Invalid arguments: ${input}`;
  }
};
