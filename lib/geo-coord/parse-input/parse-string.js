const parseValues = require("./parse-values");

const splitter = /[^\dNSEW.]+/;

module.exports = (that, input) => {
  const splitInput = input
    .split(splitter)
    .filter((value) => value !== undefined && value !== "")
    .map((value) => (isNaN(value) ? String(value) : Number(value)));
  parseValues(that, ...splitInput);
};
