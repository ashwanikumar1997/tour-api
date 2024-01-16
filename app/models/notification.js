const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  message: { type: String, required: true },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  Reciever: {
    type: Schema.Types.ObjectId,
    ref: "Agency",
    required: true,
  },
},{timestamps:true});


module.exports  = mongoose.model("Notification",NotificationSchema)