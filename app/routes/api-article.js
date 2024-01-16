const routes = require("express").Router();
const upload = require("../fileupload/handleFileUpload");
const article = require("../controllers/articles");

routes.get("/", article.all);
routes.post("/create-article", upload.single("placeImage"), article.create);
routes.get("/:id", article.get);

module.exports = routes;
