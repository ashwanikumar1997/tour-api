const moongoose = require("mongoose");

const Schema = moongoose.Schema;

const subscriptionSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = moongoose.model("Subscription", subscriptionSchema);
