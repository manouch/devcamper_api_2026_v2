const NodeGeocoder = require("node-geocoder");

const options = {
  provider: "openstreetmap",
  formatter: null,
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;

/*
const NodeGeocoder = require("node-geocoder");
const dotenv = require("dotenv");

// 🔥 MUST load env FIRST here too (important fix)
dotenv.config({ path: "./config/config.env" });

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: "https",
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
*/
