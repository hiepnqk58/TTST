const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Giới hạn mỗi IP là 100 request trong 15 phút
  message: "Quá nhiều request từ IP này, vui lòng thử lại sau 15 phút",
});

const securityMiddleware = (app) => {
  // Bảo vệ các HTTP headers với Helmet
  app.use(helmet());

  // Cấu hình CORS chi tiết
  //   app.use(
  //     cors({
  //       origin: process.env.ALLOWED_ORIGINS
  //         ? process.env.ALLOWED_ORIGINS.split(",")
  //         : "*",
  //       methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  //       allowedHeaders: ["Content-Type", "Authorization"],
  //       exposedHeaders: ["Content-Range", "X-Content-Range"],
  //       credentials: true,
  //       maxAge: 600, // 10 phút
  //     })
  //   );

  // Rate limiting
  app.use("/api/", limiter);

  // Bảo vệ NoSQL Injection
  app.use(mongoSanitize());

  // Bảo vệ XSS
  app.use(xss());

  // Ngăn chặn HTTP Parameter Pollution
  app.use(hpp());

  // Thêm Security Headers
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    })
  );

  // Disable X-Powered-By header
  app.disable("x-powered-by");

  // Thêm security headers khác
  app.use((req, res, next) => {
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
    next();
  });
};

module.exports = securityMiddleware;
