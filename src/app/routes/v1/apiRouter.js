const express = require("express");

const dashboardRoute = require("./dashboardsRouter");
const userRoute = require("./usersRouter");
const authRoute = require("./authRouter");
const toolRoute = require("./toolsRouter");
// const settingRoute = require("./settingsRouter");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/users",
    route: userRoute,
  },

  {
    path: "/auth",
    route: authRoute,
  },

  {
    path: "/dashboard",
    route: dashboardRoute,
  },
  {
    path: "/tools",
    route: toolRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
