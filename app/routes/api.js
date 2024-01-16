/**
 * @file All API routes
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/

const routes = require("express").Router();

// Controllers
const apiHomeController = require("../controllers/apihome");
//var registerController = require('../controllers/register');

// Middleware
const requireAuthorizedUser = require("../middleware/requireauthorizeduser");
const requireAdmin = require("../middleware/requireadmin");
routes.get("/", apiHomeController);
routes.use("/accounts", require("./api-accounts"));
// routes.use(requireAuthorizedUser);
routes.use("/places", require("./api-places"));
routes.use("/tours", require("./api-tours"));
routes.use("/tourpackages", require("./api-tourpackages"));
routes.use("/feeds", require("./api-feeds"));
routes.use("/bookings", require("./api-bookings"));
routes.use("/agencies", require("./api-agencies"));
routes.use("/article", require("./api-article"));
routes.use("/subscriber", require("./api-subscriber"));
module.exports = routes;
