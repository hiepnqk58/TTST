const Logger = require("./libs/logger");
const env = require("../src/configs/env");
const bannerLogger = require("./libs/banner");

const expressLoader = require("./loaders/expressLoader");
const mongooseLoader = require("./loaders/mongooseLoader");
const Database = require("./loaders/initMongodb");
const swaggerLoader = require("./loaders/swaggerLoader");
const publicLoader = require("./loaders/publicLoader");
const winstonLoader = require("./loaders/winstonLoader");
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const sslKey = fs.readFileSync(
  process.cwd() + "/src/certs/ssl-key.pem",
  "utf8"
);
const sslCert = fs.readFileSync(
  process.cwd() + "/src/certs/ssl-cert.pem",
  "utf8"
);

const options = {
  key: sslKey,
  cert: sslCert,
  rejectUnauthorized: true,
  ciphers: "ALL",
  secureProtocol: "TLS_method",
  // requestCert: true,
};

const log = new Logger(__filename);

// Init loaders
async function initApp() {
  // logging
  winstonLoader();

  // Database
  // await mongooseLoader();

  await Database.getInstance();
  // const { checkOverLoad } = require("../src/helper/checkConectMongo");
  // checkOverLoad();
  // express
  const app = expressLoader();
  // monitor
  // monitorLoader(app);

  // swagger
  swaggerLoader(app);

  // public Url
  publicLoader(app);
  // send data to fms

  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
  return app;
}

module.exports = initApp;
