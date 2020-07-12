const parseString = require("./parse-string");
const parseObject = require("./parse-object");
const parseValues = require("./parse-values");

module.exports = (that, ...input) => {
  switch (input.length) {
    case 1:
      if (typeof input[0] === "string") {
        parseString(that, input[0]);
      } else if (typeof input[0] === "object") {
        parseObject(that, input[0]);
      } else {
        throw `Invalid arguments: ${input}`;
      }
      break;
    case 2:
      if (typeof input[0] === "object" && typeof input[1] === "object") {
        parseObject(that, { latitude: input[0], longitude: input[1] });
      } else {
        parseValues(that, ...input);
      }
      break;
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
      parseValues(that, ...input);
      break;
    case 0:
    case 3:
    default:
      throw `Invalid arguments: ${input}`;
  }
};
