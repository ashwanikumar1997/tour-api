const routes = require("express").Router();

const subscriber = require("../controllers/subscription");

routes.get("/", subscriber.all);
routes.get("/create-subscriber/:subsId", subscriber.get);
routes.post("/create-subscriber", subscriber.createSubscriber);



module.exports = routes;