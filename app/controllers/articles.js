const Article = require("../models/articles");

const articleController = {
  all: (req, res) => {
    Article.find()
      .limit(100)
      .exec(function (err, results) {
        // console.log(results);
        if (err) return next(err);
       return res.status(200).send(results);
      });
  },

  get: async (req, res) => {
    const { id } = req.params;
    // console.log("id",id);
    if (!id) {
      return res.status(404).send({ message: "id not found" });
    }
    const article = await Article.findById({ _id: id });
    if (!article) {
      return res.status(404).send({ message: "article not found" });
    }
    return res.status(200).send(article);
  },

  create: (req, res) => {
    try {
      let { title, content, placeId, userId } = req.body;

      if (
        [title, content, placeId, userId].some((field) => field?.trim() === "")
      ) {
        console.log("all fields are required");
        return res.status(404).send({ message: "all field are required!" });
      }
      const placeImg = req.file?.filename;
      if (!placeImg) {
        console.log("image required");
        return res.status(404).send({ message: "image is required!" });
      }
      const article = Article.create({
        title,
        content,
        placeId,
        userId,
        placeImage: placeImg,
      });
      if (!article) {
        return res.status(400).send({ message: "something went wrong" });
      }

      return res.status(200).send({ message: "article created successfully" });
    } catch (error) {}
  },
};

module.exports = articleController;
