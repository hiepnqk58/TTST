const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const morgan = require("morgan");
const xss = require("xss-clean");
const compression = require("compression");
const bodyParser = require("body-parser");
const env = require("../configs/env");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const {
  errorConverter,
  errorHandler,
} = require("../middlewares/error.middleware");
const securityMiddleware = require("../middlewares/securityMiddleware");
const routeConfig = require("../app/routes");

module.exports = () => {
  const app = express();

  // Áp dụng các middleware bảo mật
  // securityMiddleware(app);

  // set log request với các tùy chọn bảo mật
  morgan.token("remote-addr", (req) => {
    return req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  });
  app.use(
    morgan(
      ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
    )
  );

  // parse json và urlencoded với giới hạn kích thước và validation
  app.use(
    express.json({
      limit: "10mb",
      verify: (req, res, buf) => {
        try {
          JSON.parse(buf);
        } catch (e) {
          res.status(400).json({ error: "Invalid JSON" });
          throw new Error("Invalid JSON");
        }
      },
    })
  );

  app.use(
    bodyParser.urlencoded({
      limit: "10mb",
      extended: true,
      parameterLimit: 10000,
    })
  );

  // Bảo vệ từ các cuộc tấn công brute force
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 5, // 5 lần thử đăng nhập
    message: "Quá nhiều lần đăng nhập thất bại, vui lòng thử lại sau 15 phút",
  });
  app.use("/api/auth/login", loginLimiter);

  // gzip compression với các tùy chọn bảo mật
  app.use(
    compression({
      level: 6,
      threshold: 10 * 1000,
      filter: (req, res) => {
        if (req.headers["x-no-compress"]) {
          return false;
        }
        return compression.filter(req, res);
      },
    })
  );

  // api routes với prefix
  app.use(env.app.routePrefix, routeConfig);

  // Xử lý lỗi
  app.use(errorConverter);
  app.use(errorHandler);

  // Thêm middleware xử lý lỗi cuối cùng
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      ...(env.isDevelopment && { stack: err.stack }),
    });
  });

  return app;
};
