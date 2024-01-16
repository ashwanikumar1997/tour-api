const Subscription = require("../models/subscription");
const formatBookingForOutput = require("../services/bookings/formatforoutput");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
// const transporter = require("../mailer/nodeMailer");
const config = require("../../config/config")();
const mailGun = require("mailgun-js")({
  apiKey: config.mailgun.apiKey,
  domain: config.mailgun.domain,
});

const subscriptionController = {
  all: (req, res) => {
    const subscription = Subscription.find()
      .limit(100)
      .exec((err, results) => {
        if (err) return next(err);
        var data = {};
        data = results.map(function (Booking) {
          return formatBookingForOutput(Booking);
        });
        return res
          .status(200)
          .json(new ApiResponse(200, data, "Subscriber fetched successFully"));
      });
  },

  get: async (req, res) => {
    try {
      let subs_Id = { _id: req.params.subsId };
      if (!subs_Id) {
        throw new ApiError(404, "subscriber id is required !");
      }
      const subscriber = await Subscription.findById(subs_Id);

      if (!subscriber) {
        return res.status(404).send({ message: "subscriber not found" });
      }
      return res
        .status(200)
        .json(new ApiResponse(200, subscriber, "fetched successfully"));
    } catch (error) {
      throw new ApiError(500, "Something went wrong while getting subscriber");
    }
  },

  createSubscriber: async (req, res) => {
    try {
      const { email } = req.body;
      console.log("email", email);
      if (!email) {
        throw new ApiError(404, "Subscriber email required!");
      }
      const existedEmail = await Subscription.findOne({ email });

      if (existedEmail) {
        throw new ApiError(404, "Subscriber email already Exists!");
      }
      const createdSubscriber = await Subscription.create({
        email,
      });
      if (!createdSubscriber) {
        throw new ApiError(404, "Something went wrong while create subscriber");
      }

      const data = {
        from: "Himalayan Tour & Travel <no-reply@mg.findyourenvy.com>",
        to: email,
        subject: "Subscription Confirmation",
        text: "Thank you for subscribing to our updates!",
      };

      // mailGun.messages().send(data, (error, body) => {
      //   if (error) {
      //     console.log("error", error);
      //     // res.send({
      //     //   success: false,
      //     //   message:
      //     //     "Unknown error occurred when sending the email message. Please try again later.",
      //     // });
      //   } else {
      //     // res.send({ success: true });
      //     console.log("true");
      //   }
      // });

      return res
        .status(201)
        .json(new ApiResponse(201, [], "created subscriber successfully"));
    } catch (error) {
      //   throw new ApiError(500, "Something went wrong while create subscriber");
      return res.status(400).send(error);
    }
  },
};

module.exports = subscriptionController;
